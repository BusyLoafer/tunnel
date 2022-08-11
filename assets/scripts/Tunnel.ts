import { _decorator, Component, Node, Prefab, instantiate, math, tween, Vec3, input, Input, EventKeyboard } from 'cc';
import { Player } from './Player';
import { Round } from './Round';
const { ccclass, property } = _decorator;

enum State {
	start,
	game,
	end
}

const rotation = {
	left: new Vec3(0, 0, -45),
	right: new Vec3(0, 0, 45)
}

@ccclass('Tunnel')
export class Tunnel extends Component {

	@property(Prefab)
	round: Prefab = null as any;

	@property(Node)
	player: Node = null as any;

	@property(Number)
	speed: number = 4;

	private state: State = State.start

	private rounds: Node[] = [];

	private lastRound = [1, 1, 1, 1, 1, 1, 1, 1];

	private lastPosition = 2;

	private countRounds = 0;

	private mainIndex = 0;

	private jumping = false;


	start() {
		if (!this.player || !this.round) {
			console.error("Not enough prefabs")
			return
		}

		this.player.getComponent(Player).setTunnel(this);
		this.createBaseRounds();

		this.state = State.game;
	}

	onEnable() {
		input.on(Input.EventType.KEY_UP, this.keyPress, this);
	}

	onDisable() {
		input.off(Input.EventType.KEY_UP, this.keyPress, this);
	}

	update(deltaTime: number): void {
		const { lastPosition, state, node, speed } = this;
		switch (state) {
			case State.game:
				if (lastPosition <= node.position.z) {
					this.lastPosition += 2;
					this.destroyFirstRound();
					this.generateNewLine();
					this.createNewRound();
				}
				const { position } = node
				node.setPosition(position.x, position.y, position.z + speed * deltaTime)
				break;

			default:
				break;
		}
	}

	endJump() {
		this.jumping = false;
	}

	endGame() {
		this.state = State.end;
	}

	restart() {
		this.rounds.forEach(r => r.destroy());
		this.rounds = [];
		this.lastRound = [1, 1, 1, 1, 1, 1, 1, 1];
		this.lastPosition = 2;
		this.countRounds = 0;
		this.mainIndex = 0;
		this.jumping = false;
		this.node.setPosition(0, 0, 0);
		this.player.getComponent(Player).resetPosition();
		this.createBaseRounds();
		this.state = State.game;
	}

	private createBaseRounds() {
		for (let i = 0; i < 9; i++) {
			if (i >= 5) {
				this.generateNewLine();
			}
			this.createNewRound();
		}
	}

	private keyPress(e: EventKeyboard) {
		if (!this.jumping && this.state === State.game) {
			switch (e.keyCode) {
				case 39:
					this.rotate(rotation.left)
					break;
				case 37:
					this.rotate(rotation.right)
					break;
			}
		}
	}

	private destroyFirstRound(): void {
		if (this.rounds.length) {
			const firstRound = this.rounds.shift();
			if (!firstRound.destroy()) {
				console.error("Unable to delete node")
			}
		}
	}

	private generateNewLine(): void {
		const indexСhange = math.randomRangeInt(-1, 2);
		this.mainIndex += indexСhange;
		this.mainIndex = this.mainIndex < 0 ? 7 : this.mainIndex > 7 ? 0 : this.mainIndex;
		this.lastRound = this.lastRound.map((_, i) => {
			if (i === this.mainIndex) return 1;
			return math.randomRangeInt(0, 2)
		})
	}

	private createNewRound(): void {
		const { round, lastRound, countRounds } = this;
		const newRound = instantiate(round);
		newRound.getComponent(Round)._init(-countRounds * 2, lastRound)
		this.node.addChild(newRound);
		this.rounds.push(newRound);
		this.countRounds++
	}

	private rotate(vector: Vec3): void {
		this.jumping = true;
		const scaleSpeed = 2;
		this.player.getComponent(Player).jump(scaleSpeed);
		tween(this.node).by(0.3 / scaleSpeed, { eulerAngles: vector }).start();
	}

}

