﻿class Crossbow extends RangedWeapon {

    constructor(x: number, y: number, scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager) {

        super(x, y, 27, "Crossbow", scene, new eg.Graphics.ImageSource("",64, 64));
    }

}