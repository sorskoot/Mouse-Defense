var score = 0;
/**
@brief Score trigger

Check overlap with paper balls to spawn confetti particles and
increase the score.

This component is automatically attached to newly spawned wastebins,
see `wastebin-spawner`.
*/
WL.registerComponent('score-trigger', {
    particles: {type: WL.Type.Object}
}, {
    init: function() {
        this.collision = this.object.getComponent('collision');
        this.soundHit = this.object.addComponent('howler-audio-source', {src: 'sfx/duck-quacking-37392.mp3', volume: 1.9 });
    },
    update: function(dt) {
        let overlaps = this.collision.queryOverlaps();

        for(let i = 0; i < overlaps.length; ++i) {
            let p = overlaps[i].object.getComponent('ball-physics');

            // console.log("score-trigger >>  p >> "+p);
            if(p && p.velocity[1] < 0.0 && !p.scored) {
                p.scored = true;
                this.particles.transformWorld.set(this.object.transformWorld);
                this.particles.getComponent('confetti-particles').burst();
                this.object.parent.destroy();
                // destroyTarget();
                ++score;
                // console.log("score-trigger >> scored");
                updateScore(score.toString());

                this.soundHit.play();
                /* We don't have collisions with the wastebin, simply
                 * drop it straight down to avoid it flying through */
                p.velocity.set([0, -1, 0]);
            }
        }
    },
});