class Axe extends MeleeWeapon {

    constructor(x: number, y: number, scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager) {

        super(x, y, 1, 50, "Axe", scene, new eg.Graphics.ImageSource("/Resources/Images/Items/Weapons/Axe1.png", 64, 64));

    }
}