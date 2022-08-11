import { _decorator, Component, Node, Prefab, Vec3, instantiate } from 'cc';
const { ccclass, property } = _decorator;

const positions = [
	{ x: 0, y: -1.3, z: 0 },                // D
	{ x: -0.933, y: -0.933, z: 0 },         // DL
	{ x: -1.3, y: 0, z: 0 },                // L
	{ x: -0.933, y: 0.933, z: 0 },          // UL
	{ x: 0, y: 1.3, z: 0 },                 // U
	{ x: 0.933, y: 0.933, z: 0 },           // UR
	{ x: 1.3, y: 0, z: 0 },                 // R
	{ x: 0.933, y: -0.933, z: 0 }           // DR
]

const rotations = [
	0, -45, -90, -135, 180, 135, 90, 45
]

@ccclass('Round')
export class Round extends Component {

	@property(Prefab)
	platforma: Prefab = null as any;

	@property(Prefab)
	empty: Prefab = null as any;

	private speed: number = 1;

	_init(zPos: number, points: number[]) {
		this.node.position.set(0, 0, zPos);
		this.node.children.forEach((child: Node, index: number) => {
			let newPlatform: Node;
			if (points[index] === 1) {
				newPlatform = instantiate(this.platforma);
			} else {
				newPlatform = instantiate(this.empty);
			}
			child.addChild(newPlatform)
		})
	}

	start() {
		
	}

	update(deltaTime: number) {

	}
}

