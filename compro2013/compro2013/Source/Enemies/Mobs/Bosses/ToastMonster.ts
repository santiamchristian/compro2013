class ToastMonster extends Enemy {

    constructor(x: number, y: number, scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager, enemies: Enemy[],
        items: Item[]) {
        super(100, 2, 6, 3, x, y, new eg.Graphics.ImageSource("/Resources/Images/Enemies/Bosses/ToastMonster.png", 1920, 128), 15, 20, 128, scene, collisionManager, enemies, items)

    }
} 