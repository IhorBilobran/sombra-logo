import { AnimationAction } from "./AnimationAction";
import { EventDispatcher } from "../core/EventDispatcher";
import { LinearInterpolant } from "../math/interpolants/LinearInterpolant";
import { PropertyBinding } from "./PropertyBinding";
import { PropertyMixer } from "./PropertyMixer";
import { AnimationClip } from "./AnimationClip";
/**
 *
 * Player for AnimationClips.
 *
 *
 * @author Ben Houston / http://clara.io/
 * @author David Sarno / http://lighthaus.us/
 * @author tschw
 */
export class AnimationMixer extends EventDispatcher {
  time: any;
  timeScale: any;
  stats: any;
  _root: any;
  _accuIndex: any;
  _actions: any;
  _nActiveActions: any;
  _bindings: any;
  _nActiveBindings: any;
  _controlInterpolants: any;
  _nActiveControlInterpolants: any;
  _actionsByClip: any;
  _bindingsByRootAndName: any;
  constructor(root: any) {
    super();
    this._root = root;
    this._initMemoryManager();
    this._accuIndex = 0;
    this.time = 0;
    this.timeScale = 1.0;
  }
  // return an action for a clip optionally using a custom root target
  // object (this method allocates a lot of dynamic memory in case a
  // previously unknown clip/root combination is specified)
  clipAction(clip: any, optionalRoot: any) {
    let root = optionalRoot || this._root,
      rootUuid = root.uuid,
      clipObject = typeof clip === 'string' ?
          AnimationClip.findByName(root, clip) : clip,
      clipUuid = clipObject !== null ? clipObject.uuid : clip,
      actionsForClip = this._actionsByClip[ clipUuid ],
      prototypeAction = null;
    if (actionsForClip !== undefined) {
      let existingAction =
          actionsForClip.actionByRoot[ rootUuid ];
      if (existingAction !== undefined) {
        return existingAction;
      }
      // we know the clip, so we don't have to parse all
      // the bindings again but can just copy
      prototypeAction = actionsForClip.knownActions[ 0 ];
      // also, take the clip from the prototype action
      if (clipObject === null)
        clipObject = prototypeAction._clip;
    }
    // clip must be known when specified via string
    if (clipObject === null) return null;
    // allocate all resources required to run it
    let newAction = new AnimationAction(this, clipObject, optionalRoot);
    this._bindAction(newAction, prototypeAction);
    // and make the action known to the memory manager
    this._addInactiveAction(newAction, clipUuid, rootUuid);
    return newAction;
  }
  // get an existing action
  existingAction(clip: any, optionalRoot: any) {
    let root = optionalRoot || this._root,
      rootUuid = root.uuid,
      clipObject = typeof clip === 'string' ?
          AnimationClip.findByName(root, clip) : clip,
      clipUuid = clipObject ? clipObject.uuid : clip,
      actionsForClip = this._actionsByClip[ clipUuid ];
    if (actionsForClip !== undefined) {
      return actionsForClip.actionByRoot[ rootUuid ] || null;
    }
    return null;
  }
  // deactivates all previously scheduled actions
  stopAllAction() {
    let actions = this._actions,
      nActions = this._nActiveActions,
      bindings = this._bindings,
      nBindings = this._nActiveBindings;
    this._nActiveActions = 0;
    this._nActiveBindings = 0;
    for (let i = 0; i !== nActions; ++ i) {
      actions[ i ].reset();
    }
    for (let i = 0; i !== nBindings; ++ i) {
      bindings[ i ].useCount = 0;
    }
    return this;
  }
  // advance the time and update apply the animation
  update(deltaTime: any) {
    deltaTime *= this.timeScale;
    let actions = this._actions,
      nActions = this._nActiveActions,
      time = this.time += deltaTime,
      timeDirection = Math.sign(deltaTime),
      accuIndex = this._accuIndex ^= 1;
    // run active actions
    for (let i = 0; i !== nActions; ++ i) {
      let action = actions[ i ];
      if (action.enabled) {
        action._update(time, deltaTime, timeDirection, accuIndex);
      }
    }
    // update scene graph
    let bindings = this._bindings,
      nBindings = this._nActiveBindings;
    for (let i = 0; i !== nBindings; ++ i) {
      bindings[ i ].apply(accuIndex);
    }
    return this;
  }
  // return this mixer's root target object
  getRoot() {
    return this._root;
  }
  // free all resources specific to a particular clip
  uncacheClip(clip: any) {
    let actions = this._actions,
      clipUuid = clip.uuid,
      actionsByClip = this._actionsByClip,
      actionsForClip = actionsByClip[ clipUuid ];
    if (actionsForClip !== undefined) {
      // note: just calling _removeInactiveAction would mess up the
      // iteration state and also require updating the state we can
      // just throw away
      let actionsToRemove = actionsForClip.knownActions;
      for (let i = 0, n = actionsToRemove.length; i !== n; ++ i) {
        let action = actionsToRemove[ i ];
        this._deactivateAction(action);
        let cacheIndex = action._cacheIndex,
          lastInactiveAction = actions[ actions.length - 1 ];
        action._cacheIndex = null;
        action._byClipCacheIndex = null;
        lastInactiveAction._cacheIndex = cacheIndex;
        actions[ cacheIndex ] = lastInactiveAction;
        actions.pop();
        this._removeInactiveBindingsForAction(action);
      }
      delete actionsByClip[ clipUuid ];
    }
  }
  // free all resources specific to a particular root target object
  uncacheRoot(root: any) {
    let rootUuid = root.uuid,
      actionsByClip = this._actionsByClip;
    for (let clipUuid in actionsByClip) {
      let actionByRoot = actionsByClip[ clipUuid ].actionByRoot,
        action = actionByRoot[ rootUuid ];
      if (action !== undefined) {
        this._deactivateAction(action);
        this._removeInactiveAction(action);
      }
    }
    let bindingsByRoot = this._bindingsByRootAndName,
      bindingByName = bindingsByRoot[ rootUuid ];
    if (bindingByName !== undefined) {
      for (let trackName in bindingByName) {
        let binding = bindingByName[ trackName ];
        binding.restoreOriginalState();
        this._removeInactiveBinding(binding);
      }
    }
  }
  // remove a targeted clip from the cache
  uncacheAction(clip: any, optionalRoot: any) {
    let action = this.existingAction(clip, optionalRoot);
    if (action !== null) {
      this._deactivateAction(action);
      this._removeInactiveAction(action);
    }
  }
  // Implementation details:
  _bindAction(action: any, prototypeAction: any) {
    let root = action._localRoot || this._root,
      tracks = action._clip.tracks,
      nTracks = tracks.length,
      bindings = action._propertyBindings,
      interpolants = action._interpolants,
      rootUuid = root.uuid,
      bindingsByRoot = this._bindingsByRootAndName,
      bindingsByName = bindingsByRoot[ rootUuid ];
    if (bindingsByName === undefined) {
      bindingsByName = {};
      bindingsByRoot[ rootUuid ] = bindingsByName;
    }
    for (let i = 0; i !== nTracks; ++ i) {
      let track = tracks[ i ],
        trackName = track.name,
        binding = bindingsByName[ trackName ];
      if (binding !== undefined) {
        bindings[ i ] = binding;
      } else {
        binding = bindings[ i ];
        if (binding !== undefined) {
          // existing binding, make sure the cache knows
          if (binding._cacheIndex === null) {
            ++ binding.referenceCount;
            this._addInactiveBinding(binding, rootUuid, trackName);
          }
          continue;
        }
        let path = prototypeAction && prototypeAction.
            _propertyBindings[ i ].binding.parsedPath;
        binding = new PropertyMixer(
            PropertyBinding.create(root, trackName, path),
            track.ValueTypeName, track.getValueSize());
        ++ binding.referenceCount;
        this._addInactiveBinding(binding, rootUuid, trackName);
        bindings[ i ] = binding;
      }
      interpolants[ i ].resultBuffer = binding.buffer;
    }
  }
  _activateAction(action: any) {
    if (! this._isActiveAction(action)) {
      if (action._cacheIndex === null) {
        // this action has been forgotten by the cache, but the user
        // appears to be still using it -> rebind
        let rootUuid = (action._localRoot || this._root).uuid,
          clipUuid = action._clip.uuid,
          actionsForClip = this._actionsByClip[ clipUuid ];
        this._bindAction(action,
            actionsForClip && actionsForClip.knownActions[ 0 ]);
        this._addInactiveAction(action, clipUuid, rootUuid);
      }
      let bindings = action._propertyBindings;
      // increment reference counts / sort out state
      for (let i = 0, n = bindings.length; i !== n; ++ i) {
        let binding = bindings[ i ];
        if (binding.useCount ++ === 0) {
          this._lendBinding(binding);
          binding.saveOriginalState();
        }
      }
      this._lendAction(action);
    }
  }
  _deactivateAction(action: any) {
    if (this._isActiveAction(action)) {
      let bindings = action._propertyBindings;
      // decrement reference counts / sort out state
      for (let i = 0, n = bindings.length; i !== n; ++ i) {
        let binding = bindings[ i ];
        if (-- binding.useCount === 0) {
          binding.restoreOriginalState();
          this._takeBackBinding(binding);
        }
      }
      this._takeBackAction(action);
    }
  }
  // Memory manager
  _initMemoryManager() {
    this._actions = []; // 'nActiveActions' followed by inactive ones
    this._nActiveActions = 0;
    this._actionsByClip = {};
    // inside:
    // {
    //     knownActions: Array< AnimationAction >  - used as prototypes
    //     actionByRoot: AnimationAction      - lookup
    // }
    this._bindings = []; // 'nActiveBindings' followed by inactive ones
    this._nActiveBindings = 0;
    this._bindingsByRootAndName = {}; // inside: Map< name, PropertyMixer >
    this._controlInterpolants = []; // same game as above
    this._nActiveControlInterpolants = 0;
    let scope = this;
    this.stats = {
      actions: {
        get total() { return scope._actions.length; },
        get inUse() { return scope._nActiveActions; }
      },
      bindings: {
        get total() { return scope._bindings.length; },
        get inUse() { return scope._nActiveBindings; }
      },
      controlInterpolants: {
        get total() { return scope._controlInterpolants.length; },
        get inUse() { return scope._nActiveControlInterpolants; }
      }
    };
  }
  // Memory management for AnimationAction objects
  _isActiveAction(action: any) {
    let index = action._cacheIndex;
    return index !== null && index < this._nActiveActions;
  }
  _addInactiveAction(action: any, clipUuid: any, rootUuid: any) {
    let actions = this._actions,
      actionsByClip = this._actionsByClip,
      actionsForClip = actionsByClip[ clipUuid ];
    if (actionsForClip === undefined) {
      actionsForClip = {
        knownActions: [ action ],
        actionByRoot: {}
      };
      action._byClipCacheIndex = 0;
      actionsByClip[ clipUuid ] = actionsForClip;
    } else {
      let knownActions = actionsForClip.knownActions;
      action._byClipCacheIndex = knownActions.length;
      knownActions.push(action);
    }
    action._cacheIndex = actions.length;
    actions.push(action);
    actionsForClip.actionByRoot[ rootUuid ] = action;
  }
  _removeInactiveAction(action: any) {
    let actions = this._actions,
      lastInactiveAction = actions[ actions.length - 1 ],
      cacheIndex = action._cacheIndex;
    lastInactiveAction._cacheIndex = cacheIndex;
    actions[ cacheIndex ] = lastInactiveAction;
    actions.pop();
    action._cacheIndex = null;
    let clipUuid = action._clip.uuid,
      actionsByClip = this._actionsByClip,
      actionsForClip = actionsByClip[ clipUuid ],
      knownActionsForClip = actionsForClip.knownActions,
      lastKnownAction =
        knownActionsForClip[ knownActionsForClip.length - 1 ],
      byClipCacheIndex = action._byClipCacheIndex;
    lastKnownAction._byClipCacheIndex = byClipCacheIndex;
    knownActionsForClip[ byClipCacheIndex ] = lastKnownAction;
    knownActionsForClip.pop();
    action._byClipCacheIndex = null;
    let actionByRoot = actionsForClip.actionByRoot,
      rootUuid = (actions._localRoot || this._root).uuid;
    delete actionByRoot[ rootUuid ];
    if (knownActionsForClip.length === 0) {
      delete actionsByClip[ clipUuid ];
    }
    this._removeInactiveBindingsForAction(action);
  }
  _removeInactiveBindingsForAction(action: any) {
    let bindings = action._propertyBindings;
    for (let i = 0, n = bindings.length; i !== n; ++ i) {
      let binding = bindings[ i ];
      if (-- binding.referenceCount === 0) {
        this._removeInactiveBinding(binding);
      }
    }
  }
  _lendAction(action: any) {
    // [ active actions |  inactive actions  ]
    // [  active actions >| inactive actions ]
    //                 s        a
    //                  <-swap->
    //                 a        s
    let actions = this._actions,
      prevIndex = action._cacheIndex,
      lastActiveIndex = this._nActiveActions ++,
      firstInactiveAction = actions[ lastActiveIndex ];
    action._cacheIndex = lastActiveIndex;
    actions[ lastActiveIndex ] = action;
    firstInactiveAction._cacheIndex = prevIndex;
    actions[ prevIndex ] = firstInactiveAction;
  }
  _takeBackAction(action: any) {
    // [  active actions  | inactive actions ]
    // [ active actions |< inactive actions  ]
    //        a        s
    //         <-swap->
    //        s        a
    let actions = this._actions,
      prevIndex = action._cacheIndex,
      firstInactiveIndex = -- this._nActiveActions,
      lastActiveAction = actions[ firstInactiveIndex ];
    action._cacheIndex = firstInactiveIndex;
    actions[ firstInactiveIndex ] = action;
    lastActiveAction._cacheIndex = prevIndex;
    actions[ prevIndex ] = lastActiveAction;
  }
  // Memory management for PropertyMixer objects
  _addInactiveBinding(binding: any, rootUuid: any, trackName: any) {
    let bindingsByRoot = this._bindingsByRootAndName,
      bindingByName = bindingsByRoot[ rootUuid ],
      bindings = this._bindings;
    if (bindingByName === undefined) {
      bindingByName = {};
      bindingsByRoot[ rootUuid ] = bindingByName;
    }
    bindingByName[ trackName ] = binding;
    binding._cacheIndex = bindings.length;
    bindings.push(binding);
  }
  _removeInactiveBinding(binding: any) {
    let bindings = this._bindings,
      propBinding = binding.binding,
      rootUuid = propBinding.rootNode.uuid,
      trackName = propBinding.path,
      bindingsByRoot = this._bindingsByRootAndName,
      bindingByName = bindingsByRoot[ rootUuid ],
      lastInactiveBinding = bindings[ bindings.length - 1 ],
      cacheIndex = binding._cacheIndex;
    lastInactiveBinding._cacheIndex = cacheIndex;
    bindings[ cacheIndex ] = lastInactiveBinding;
    bindings.pop();
    delete bindingByName[ trackName ];
    remove_empty_map: {
      for (let _ in bindingByName) break remove_empty_map;
      delete bindingsByRoot[ rootUuid ];
    }
  }
  _lendBinding(binding: any) {
    let bindings = this._bindings,
      prevIndex = binding._cacheIndex,
      lastActiveIndex = this._nActiveBindings ++,
      firstInactiveBinding = bindings[ lastActiveIndex ];
    binding._cacheIndex = lastActiveIndex;
    bindings[ lastActiveIndex ] = binding;
    firstInactiveBinding._cacheIndex = prevIndex;
    bindings[ prevIndex ] = firstInactiveBinding;
  }
  _takeBackBinding(binding: any) {
    let bindings = this._bindings,
      prevIndex = binding._cacheIndex,
      firstInactiveIndex = -- this._nActiveBindings,
      lastActiveBinding = bindings[ firstInactiveIndex ];
    binding._cacheIndex = firstInactiveIndex;
    bindings[ firstInactiveIndex ] = binding;
    lastActiveBinding._cacheIndex = prevIndex;
    bindings[ prevIndex ] = lastActiveBinding;
  }
  // Memory management of Interpolants for weight and time scale
  _lendControlInterpolant() {
    let interpolants = this._controlInterpolants,
      lastActiveIndex = this._nActiveControlInterpolants ++,
      interpolant = interpolants[ lastActiveIndex ];
    if (interpolant === undefined) {
      interpolant = new LinearInterpolant(
          new Float32Array(2), new Float32Array(2),
            1, this._controlInterpolantsResultBuffer);
      interpolant.__cacheIndex = lastActiveIndex;
      interpolants[ lastActiveIndex ] = interpolant;
    }
    return interpolant;
  }
  _takeBackControlInterpolant(interpolant: any) {
    let interpolants = this._controlInterpolants,
      prevIndex = interpolant.__cacheIndex,
      firstInactiveIndex = -- this._nActiveControlInterpolants,
      lastActiveInterpolant = interpolants[ firstInactiveIndex ];
    interpolant.__cacheIndex = firstInactiveIndex;
    interpolants[ firstInactiveIndex ] = interpolant;
    lastActiveInterpolant.__cacheIndex = prevIndex;
    interpolants[ prevIndex ] = lastActiveInterpolant;
  }
  _controlInterpolantsResultBuffer = new Float32Array(1);
}