import { OrbitControls } from './OrbitControls.js';

class ThreeDScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        this.scene.background = new THREE.Color('ForestGreen');

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.isOrbitEnabled = true;
        this.animationXEnabled = false;
        this.animationYEnabled = false;
        this.speedFactor = 1;

        this.goalObject = new THREE.Object3D();
        this.initGoal();
        this.initFlag();
        this.initBall();
		this.initCameraPosition();

        this.controls.update();

        document.addEventListener('keydown', this.toggleOrbit.bind(this));
        document.addEventListener('keydown', this.handleKeyPress.bind(this));

        this.animate();
    }

    degreesToRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

	initCameraPosition() {
		const cameraMatrix = new THREE.Matrix4();
		cameraMatrix.makeTranslation(0, 0, 150);
		this.camera.applyMatrix4(cameraMatrix);
	}

    initGoal() {
        const scaleMatrix = new THREE.Matrix4();
        scaleMatrix.makeScale(0.95, 0.95, 0.95);
        this.shrinkMatrix = scaleMatrix;

        const createPost = (translationX) => {
            const postMatrix = new THREE.Matrix4();
            postMatrix.makeTranslation(translationX, 0, 0);
            const postGeometry = new THREE.CylinderGeometry(1, 1, 40, 15);
            const postMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.applyMatrix4(postMatrix);
            return post;
        };

        const createBackSupport = (translationX) => {
            const supportMatrix = new THREE.Matrix4();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationX(this.degreesToRadians(30));
            supportMatrix.makeTranslation(translationX, 0, -11.547);
            supportMatrix.multiply(rotationMatrix);
            const supportGeometry = new THREE.CylinderGeometry(1, 1, 46.188, 15);
            const supportMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.applyMatrix4(supportMatrix);
            return support;
        };

        const createCrossbar = () => {
            const crossbarMatrix = new THREE.Matrix4();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationZ(this.degreesToRadians(90));
            crossbarMatrix.makeTranslation(0, 19.5, 0);
            crossbarMatrix.multiply(rotationMatrix);
            const crossbarGeometry = new THREE.CylinderGeometry(1, 1, 120, 15);
            const crossbarMaterial = new THREE.MeshBasicMaterial({ color: 'white' });
            const crossbar = new THREE.Mesh(crossbarGeometry, crossbarMaterial);
            crossbar.applyMatrix4(crossbarMatrix);
            return crossbar;
        };

        const createBackNet = () => {
            const backNetMatrix = new THREE.Matrix4();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationX(this.degreesToRadians(30));
            backNetMatrix.makeTranslation(0, 0, -11.547);
            backNetMatrix.multiply(rotationMatrix);
            const backNetGeometry = new THREE.PlaneGeometry(120, 46.188);
            const backNetMaterial = new THREE.MeshBasicMaterial({ color: 'lightgrey', side: THREE.DoubleSide });
            const backNet = new THREE.Mesh(backNetGeometry, backNetMaterial);
            backNet.applyMatrix4(backNetMatrix);
            return backNet;
        };

        const createTriangleNet = (translationX) => {
            const triangleShape = new THREE.Shape();
            triangleShape.moveTo(0, 0);
            triangleShape.lineTo(0, 40);
            triangleShape.lineTo(23.094, 0);
            triangleShape.lineTo(0, 0);

            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationY(this.degreesToRadians(90));

            const triangleMatrix = new THREE.Matrix4();
            triangleMatrix.makeTranslation(translationX, -20, 0);
            triangleMatrix.multiply(rotationMatrix);

            const triangleGeometry = new THREE.ShapeGeometry(triangleShape);
            const triangleMaterial = new THREE.MeshBasicMaterial({ color: 'lightgrey', side: THREE.DoubleSide });
            const triangle = new THREE.Mesh(triangleGeometry, triangleMaterial);
            triangle.applyMatrix4(triangleMatrix);
            return triangle;
        };

        const createRing = (rotationX, translationY, target) => {
            const ringMatrix = new THREE.Matrix4();
            const rotationMatrix = new THREE.Matrix4();
            rotationMatrix.makeRotationX(this.degreesToRadians(rotationX));
            ringMatrix.makeTranslation(0, translationY, 0);
            ringMatrix.multiply(rotationMatrix);

            const ringGeometry = new THREE.TorusGeometry(1, 1, 15, 40);
            const ringMaterial = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeometry, ringMaterial);
            ring.applyMatrix4(ringMatrix);
            target.add(ring);
        };

        const post1 = createPost(59.5);
        const post2 = createPost(-59.5);
        const crossbar = createCrossbar();
        const backSupport1 = createBackSupport(59.5);
        const backSupport2 = createBackSupport(-59.5);
        const backNet = createBackNet();
        const triangleNet1 = createTriangleNet(-59.5);
        const triangleNet2 = createTriangleNet(59.5);

        this.goalObject.add(post1);
        this.goalObject.add(post2);
        this.goalObject.add(crossbar);
        this.goalObject.add(backSupport1);
        this.goalObject.add(backSupport2);
        this.goalObject.add(backNet);
        this.goalObject.add(triangleNet1);
        this.goalObject.add(triangleNet2);

        createRing(90, -20, post1);
        createRing(90, -20, post2);
        createRing(60, -23.094, backSupport1);
        createRing(60, -23.094, backSupport2);

        this.scene.add(this.goalObject);
    }

	initFlag() {
		const flagMatrix = new THREE.Matrix4();
		flagMatrix.makeTranslation(0, 30, 0);
	
		const textureLoader = new THREE.TextureLoader();
		const flagTexture = textureLoader.load('https://as1.ftcdn.net/v2/jpg/04/17/82/34/1000_F_417823457_gKgmxNcs0cKtZjv0fcfoG0ZLy3gXMdAt.jpg');
		const flagMaterial = new THREE.MeshBasicMaterial({ map: flagTexture, side: THREE.DoubleSide });
		const flagGeometry = new THREE.PlaneGeometry(120, 20);
		const flag = new THREE.Mesh(flagGeometry, flagMaterial);
		flag.applyMatrix4(flagMatrix);
	
		this.goalObject.add(flag);
	}
	

    initBall() {
        const ballMatrix = new THREE.Matrix4();
        ballMatrix.makeTranslation(0, 0, 40);
        const ballGeometry = new THREE.SphereGeometry(2.5, 30, 15);
        const ballMaterial = new THREE.MeshBasicMaterial({ color: 'black' });
        this.ball = new THREE.Mesh(ballGeometry, ballMaterial);
        this.ball.applyMatrix4(ballMatrix);
        this.scene.add(this.ball);
    }

    toggleWireframe() {
        this.goalObject.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.material.wireframe = !child.material.wireframe;
            }
        });
        this.ball.material.wireframe = !this.ball.material.wireframe;
    }

    toggleOrbit(event) {
        if (event.key === 'o') {
            this.isOrbitEnabled = !this.isOrbitEnabled;
        }
    }

    handleKeyPress(event) {
        switch (event.key) {
            case 'w':
                this.toggleWireframe();
                break;
            case '+':
            case 'ArrowUp':
                this.speedFactor *= 1.1;
                break;
            case '-':
            case 'ArrowDown':
                this.speedFactor *= 0.9;
                break;
            case '1':
                this.animationXEnabled = !this.animationXEnabled;
                break;
            case '2':
                this.animationYEnabled = !this.animationYEnabled;
                break;
            case '3':
                this.goalObject.applyMatrix4(this.shrinkMatrix);
                break;
        }
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        this.controls.enabled = this.isOrbitEnabled;
        this.animateBall();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    animateBall() {
        if (this.animationXEnabled) {
            this.ball.applyMatrix4(this.createRotationMatrix('x', this.speedFactor));
        }
        if (this.animationYEnabled) {
            this.ball.applyMatrix4(this.createRotationMatrix('y', this.speedFactor));
        }
    }

    createRotationMatrix(axis, angle) {
        const rotationMatrix = new THREE.Matrix4();
        switch (axis) {
            case 'x':
                rotationMatrix.makeRotationX(this.degreesToRadians(angle));
                break;
            case 'y':
                rotationMatrix.makeRotationY(this.degreesToRadians(angle));
                break;
        }
        return rotationMatrix;
    }
}

new ThreeDScene();
