// var wastebinSpawner = null;
var floorHeight = 0;

/**
@brief
*/
WL.registerComponent('mouse-spawner', {
    targetMesh: {type: WL.Type.Mesh},
    targetMaterial: {type: WL.Type.Material},
    spawnAnimation: {type: WL.Type.Animation},
    maxTargets: {type: WL.Type.Int, default: 20},
    particles: {type: WL.Type.Object},
}, {
    init: function() {
        this.time = 0;
        this.spawnInterval = 3;
        this.critterSound = this.object.addComponent('howler-audio-source', {src: 'sfx/critter-40645.mp3', loop: true, volume: 1.0 });
    },
    start: function() {
        // WL.onXRSessionStart.push(this.xrSessionStart.bind(this));
        this.targets = [];

        // targetSpawner = this;
        this.spawnTarget();
    },
    update: function(dt) {
        this.time += dt;
        if(this.targets.length >= this.maxTargets) return;

        if(this.time >= this.spawnInterval){
            this.time = 0;
            this.spawnTarget();
        }

        // updateScore("Place a target");
    },
    spawnTarget: function() {
        // console.log("target-spawner >> spawnTarget");
        // if(this.targets.length >= this.maxTargets) return;
        /* Only spawn object if cursor is visible */

        const obj = WL.scene.addObject();
        obj.transformLocal.set(this.object.transformWorld);

        // const pos = [0, 0, 0];
        // this.object.getTranslationWorld(pos);
        // /* Make sure balls and confetti land on the floor */
        // floorHeight = pos[1];

        obj.scale([0.1, 0.1, 0.1]);
        const mesh = obj.addComponent('mesh');
        mesh.mesh = this.targetMesh;
        mesh.material = this.targetMaterial;
        mesh.active = true;
        obj.addComponent("mouse-mover");

        if(this.spawnAnimation) {
            const anim = obj.addComponent('animation');
            anim.playCount = 1;
            anim.animation = this.spawnAnimation;
            anim.active = true;
            anim.play();
        }

        /* Add scoring trigger */
        const trigger = WL.scene.addObject(obj);
        const col = trigger.addComponent('collision');
        col.collider = WL.Collider.Sphere;
        col.extents[0] = 0.6;
        col.group = (1 << 0);
        col.active = true;
        trigger.translate([0, 0.4, 0]);
        trigger.addComponent('score-trigger', {
            particles: this.particles
        });

        obj.setDirty();

        this.targets.push(obj);
        this.critterSound.play();

        // if(this.targets.length == this.maxTargets) {
        //     updateScore("Swipe to\nthrow");
        //     // paperBallSpawner.getComponent('mesh').active = true;
        //     paperBallSpawner.getComponent('paperball-spawner').active = true;
        //     /* Hide cursor */
        //     this.object.getComponent('mesh').active = false;
        // }
    },
    // destroyTarget: function(){
    //     console.log("destroyTarget");
    //     // this.targets.pop();
    // }
    // onActivate: function() {
    //     if(WL.xrSession) {
    //         WL.xrSession.addEventListener('select', this.onClick.bind(this));
    //     }
    // },
    // xrSessionStart: function(session) {
    //     if(this.active) {
    //         session.addEventListener('select', this.onClick.bind(this));
    //     }
    // },
});
