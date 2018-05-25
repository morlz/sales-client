export default {
	props: {
		value: {
			type: String,
			required: true
		}
	},
	data() {
		return {
			camera: new THREE.PerspectiveCamera(70, window.innerWidth / window.offsetHeight, 1, 100000),
			scene: new THREE.Scene(),
			renderer: new THREE.WebGLRenderer(),
			GLTFLoader: new THREE.GLTFLoader(),
			background: new THREE.CubeTextureLoader()
				.setPath('statics/skybox/')
				.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']),
			lights: {
				ambient: new THREE.AmbientLight(0xffffff, 2),
				point: new THREE.PointLight(0xffffff, 4)
			},
			objects: {},
			mouse: {
				x: 0,
				y: 0
			}
		}
	},
	watch: {
		value (n) {
			this.objects.bodyMesh.material.map.image.src = n
		}
	},
	methods: {
		init () {
			// config the renderer
			this.renderer.setPixelRatio(window.devicePixelRatio)
			this.renderer.setSize(this.$el.offsetWidth, this.$el.offsetHeight)
			this.$el.appendChild(this.renderer.domElement)

			// move point light
			this.lights.point.position.set(550, 3000, 0)

			//set the scene background
			this.scene.background = this.background

			//apply scene lights
			Object.values(this.lights).map(light => this.scene.add(light))

			window.scene = this.scene

			//load sofa 3d model
			this.GLTFLoader.load('statics/sofa/scene.gltf', this.createScene)
		},
		animate () {
			requestAnimationFrame(this.animate)
			this.render()
		},
		render () {
			var timer = -0.0002 * Date.now()

			this.camera.position.x = 800 * Math.cos(timer)
			this.camera.position.y += (-this.mouse.y - this.camera.position.y) * .05
			this.camera.position.z = 800 * Math.sin(timer)
			this.camera.lookAt(this.scene.position)

			this.renderer.render(this.scene, this.camera)
		},
		onWindowResize () {
			this.camera.aspect = this.$el.offsetWidth / this.$el.offsetHeight
			this.camera.updateProjectionMatrix()
			this.renderer.setSize(this.$el.offsetWidth, this.$el.offsetHeight)
		},
		createScene (g) {
			let main = g.scene.getObjectByName('pasted__sofabody2_pasted__sofabody2Shape_bakedmtl2_0')

			main.material.roughness = 1
			main.material.roughnessMap = null
			main.material.metalness = 0

			main.material.map.wrapS = main.material.map.wrapT = THREE.RepeatWrapping
			main.material.map.offset.set( 0, 0 )
			main.material.map.repeat.set( 5, 5 )

			main.material.map.image.src = this.value

			this.$set(this.objects, 'sofa', g.scene)
			this.$set(this.objects, 'bodyMesh', main)


			console.log(g.scene, { ...main }, main.material);

			this.scene.add( g.scene )
		},
		onDocumentMouseMove (e) {
			this.mouse.y = e.clientY - window.innerHeight
		}
	},
	mounted () {
		this.init()
		this.animate()
		this.onWindowResize()
		window.addEventListener('resize', this.onWindowResize, false)
		document.addEventListener('mousemove', this.onDocumentMouseMove, false)
	},
	render (h) {
		return h('div', {
			class: {
				'Sofa3DView' : true
			}
		})
	},
	beforeDestroy () {
		window.removeEventListener('resize', this.onWindowResize)
		document.removeEventListener('mousemove', this.onDocumentMouseMove)
	}
}
