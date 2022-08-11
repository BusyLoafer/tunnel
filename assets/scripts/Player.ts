import { _decorator, Component, Node, Animation, SphereCollider, ICollisionEvent, Vec3 } from 'cc';
import { Tunnel } from './Tunnel';
const { ccclass, property } = _decorator;

@ccclass('Player')
export class Player extends Component {

    private animation: Animation;
    private tunnel: Tunnel;

    start() {
        this.animation = this.node.getComponent(Animation);
        const collider = this.node.getComponent(SphereCollider);
        collider.on('onTriggerEnter', this.onCollision, this);
    }

    update(deltaTime: number) {
        //
    }

    setTunnel(t: Tunnel) {
        this.tunnel = t;
    }

    resetPosition() {
        this.node.setPosition(0, -1.044, 0)
    }

    jump(scaleSpeed: number = 1) {
        this.animation.getState('jump').speed = scaleSpeed;
        this.animation.play('jump')
    }

    endJump() {
        this.tunnel.endJump();
    }

    restart() {
        this.tunnel.restart();
    }

    private onCollision (event: ICollisionEvent) {
        this.tunnel.endGame();
        this.animation.play('falling')
    }

}

