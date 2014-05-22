﻿class FrostTome extends RangedWeapon {

    constructor(x: number, y: number, scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager, items: Item[]) {

        super(x, y, 10, 15, "FrostTome", scene, new eg.Graphics.ImageSource("/Resources/Images/Items/Weapons/FrostTome.png", 64, 64), collisionManager, items);
    }

    ExecuteAttack(projectiles?: Projectile[]) {
        projectiles.push(new Projectile(this.sprite.Position.X, this.sprite.Position.Y, this.damage, 50, this.sprite.Rotation, this.knockback, this.scene, new eg.Graphics.ImageSource("/Resources/Images/Items/Weapons/FrostBolt.png", 64, 64), this.collisionManager, projectiles));
    }

}