import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as THREE from 'three';
// import { OrbitControls } from 'three-orbitcontrols-ts';
import { TimelineMax } from 'gsap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('container') container: ElementRef<any>;

  private sceneWidth;
  private sceneHeight;

  // enviroment
  private camera;
  private controls: any;
  private scene: any;
  private light: any;
  private renderer: any;

  private pointsGeometry;

  private svgWidth = 240;
  private svgHeight = 60;

  private gallery = [];
  private initialGallery = [];

  private currentGalleryItem = 0;
  private animationFrameIndex = 0;

  private destroyStatus = false;

  private initCameraPosition = 1700;

  constructor() {
  }

  ngOnInit() {
    this.sceneSizes();
    this.sceneInit();
    this.initSVGCanvas();
  }


  public destroy(): void {
    this.destroyStatus = !this.destroyStatus;
  }

  // NEXT SVG
  public next(): void {
    this.currentGalleryItem = this.currentGalleryItem ? 0 : 1;

    this.pointsGeometry.vertices.forEach((particle, index) => {
      const tl = new TimelineMax();

      tl.to(
        particle, 2, {
          x: this.gallery[this.currentGalleryItem][index][0],
          y: this.gallery[this.currentGalleryItem][index][1]
        }
      );
    });
  }

  // SET SVG GEOMETRY
  public svgInitialState(): void {
    this.destroyStatus = false;
    this.pointsGeometry.vertices.forEach((particle, index) => {
      const tl = new TimelineMax();

      tl.to(particle, 3, {
        x: this.initialGallery[this.currentGalleryItem][index][0],
        y: this.initialGallery[this.currentGalleryItem][index][1],
        z: Math.random() * 120
      });
    });
  }

  private sceneInit() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xcccccc);

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);

    this.container.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(25, this.sceneWidth / this.sceneHeight, 2, 5000);
    this.camera.position.z = this.initCameraPosition;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));

    this.pointsInit();
  }

  private pointsInit(): void {
    this.pointsGeometry = new THREE.Geometry();

    const material = new THREE.PointsMaterial({
      size: 22,
      vertexColors: THREE.VertexColors,
      alphaTest: 0.5
    });

    for (let i = 0; i < 17550; i++) {
      this.pointsGeometry.vertices.push(
        new THREE.Vector3(
          THREE.Math.randInt(-2500, 2500),
          THREE.Math.randInt(-2500, 2500),
          THREE.Math.randInt(-2500, 2500)
        ));

      this.pointsGeometry.colors.push(new THREE.Color(`hsl(136, 52%, ${THREE.Math.randInt(20, 70)}%)`));
    }

    const pointCloud = new THREE.PointCloud(this.pointsGeometry, material);

    this.scene.add(pointCloud);

    this.render();
  }

  private loadImages(paths, whenLoaded) {
    const imgs = [];

    paths.forEach((path) => {
      const img = new Image;
      img.onload = () => {
        imgs.push(img);

        if (imgs.length === paths.length) {
          // success callback
          whenLoaded(imgs);
        }
      };

      img.src = path;
    });
  }

  private initSVGCanvas(): void {
    const canvas = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    canvas.width = this.sceneWidth;
    canvas.height = this.sceneHeight;

    // init images
    const imagesURL = ['assets/sombra-logo.svg', 'assets/creating-value.svg'];

    this.loadImages(imagesURL, (images) => {

      images.forEach((el, index) => {
        const coords = this.getImageCoords(ctx, images[index]);

        this.gallery.push(coords);
        this.initialGallery.push(coords);
      });


      this.svgInitialState();
      this.animate();
    });
  }

  // заповнити масив наступної картинки у відповідність до першої
  private fillUp(array: any[], max: number) {
    const length = array.length;

    for (let i = 0; i < max - length; i++) {
      array.push(array[Math.floor(Math.random() * length)]);
    }
    return array;
  }

  private shuffle(a: any[]): any[] {
    for (let i = a.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [a[i - 1], a[j]] = [a[j], a[i - 1]];
    }
    return a;
  }

  private getImageCoords(ctx: CanvasRenderingContext2D, img): any {
    const imageCoords = [];

    // очищення canvas він попереднього значення
    ctx.clearRect(0, 0, this.svgWidth, this.svgHeight)
    ctx.drawImage(img, 0, 0, this.svgWidth, this.svgHeight);

    const ctxData = ctx.getImageData(0, 0, this.svgWidth, this.svgHeight);
    const data = ctxData.data;

    console.log('* context data length - ', ctxData.data.length);

    for (let y = 0; y < this.svgHeight; y++) {
      for (let x = 0; x < this.svgWidth; x++) {

        const alpha = data[((this.svgWidth * y) + x) * 4 + 3];

        if (alpha > 0) {
          // внормування координат до 3d сітки
          imageCoords.push([10 * (x - this.svgWidth / 2), 10 * (this.svgHeight / 2 - y)]);
          // imageCoords.push(x,y)
        }
      }
    }

    const pointsAmount = 5850 * 3;

    console.log('* imageCoords data length - ', this.shuffle(this.fillUp(imageCoords, pointsAmount)).length);
    return this.shuffle(this.fillUp(imageCoords, pointsAmount));
  }

  private pointsAnimation(): void {
    let dX, dY, dZ;

    this.pointsGeometry.vertices.forEach((vector, index) => {

      if (this.destroyStatus) {
          const tang = Math.tan(index / 10) * vector.length() / 200;
          const pi = Math.PI / Math.random() / 100;

          dX = Math.sin((index * 10)) * (Math.random() * 10)
          dY = Math.sin(index / 100) / 100

          dZ = Math.sin(index / 2) * (Math.random() * 100);

          vector.add(new THREE.Vector3(dX, dY, dZ));
      } else {
        dX = Math.sin(this.animationFrameIndex / 10 + index) / 10;
        dY = Math.sin(this.animationFrameIndex / 10 + index / 2) / 10;
        dZ = Math.sin(this.animationFrameIndex / 10 + index / 2) / 10;

        vector.add(new THREE.Vector3(dX, dY, dZ));
      }
    });

    this.pointsGeometry.verticesNeedUpdate = true;
  }

  private animate(): void {
    this.animationFrameIndex++;

    // run manipulation
    this.pointsAnimation();

    // animation handling
    requestAnimationFrame(this.animate.bind(this));

    this.render();
  }

  private render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:resize')
  responsiveScene(): void {
    this.sceneSizes();
    this.camera.aspect = this.sceneWidth / this.sceneHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.sceneWidth, this.sceneHeight);
  }

  @HostListener('window:mousemove', ['$event'])
  cameraMovement(event: MouseEvent): void {
    const dX = ((this.sceneWidth / 2) - event.x) / 7;
    const dY = ((this.sceneHeight / 2) - event.y) / 20;
    const dZ = this.initCameraPosition + dY;

    if (this.camera) {
      this.camera.lookAt(new THREE.Vector3(-dX, dY, 0));
      this.camera.position.z = dZ;
    }
    // TODO: on mouse over - reset x,y
  }

  @HostListener('window:scroll', ['$event'])
  scrollHandling(event): void {
    // this.scrollIndex++
    // if (window.scrollY >= 150) {
    //   this.destroy();
    // }
    // if (window.scrollY >= 170) {
    //   this.reset();
    // }
  }

  private sceneSizes(): void {
    this.sceneWidth = window.innerWidth;
    this.sceneHeight = window.innerWidth * 0.25;
  }
}
