class Enemy extends eg.Collision.Collidable implements eg.IUpdateable, ICollidableTyped {
    collisionType: CollisionType;
    circle: eg.Graphics.Circle;
    attacking: boolean;
    health: number;
    damage: number;
    attackspeed: number;
    speed: number;
    targetedPlayer: Player;
    attackTimer: number;
    range: eg.Collision.Collidable;
    collisionManager: eg.Collision.CollisionManager;
    lastCollision: eg.Collision.Collidable;
    sprite: eg.Graphics.Sprite2d;
    imageSource: eg.Graphics.ImageSource;
    scene: eg.Rendering.Scene2d;
    movementController: eg.MovementControllers.LinearMovementController;
    

    constructor(health: number, damage: number, attackspeed: number, speed: number, x: number, y: number, imageSource: eg.Graphics.ImageSource, scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager) {
        this.collisionManager = collisionManager;
        this.collisionType = CollisionType.Enemy;
        this.imageSource = imageSource;
        this.sprite = new eg.Graphics.Sprite2d(x, y, this.imageSource);
        this.attackTimer = 0;
        this.attacking = false;
        this.sprite.ZIndex = ZIndexing.Enemy;
        super(this.sprite.GetDrawBounds());
        this.scene = scene;
        this.health = health;
        this.damage = damage;
        this.attackspeed = attackspeed;
        this.speed = speed;
        this.scene.Add(this.sprite);
        this.range = new eg.Collision.Collidable(new eg.Bounds.BoundingCircle(this.sprite.Position, 500));
        this.range.OnCollision.Bind(this.RangeCollided.bind(this));
        this.collisionManager.Monitor(this.range);
        this.collisionManager.Monitor(this);
        this.movementController = new eg.MovementControllers.LinearMovementController(new Array<eg.IMoveable>(this.range.Bounds, this.Bounds, this.sprite), this.speed, true);
        
        
    }

    RangeCollided(data: eg.Collision.CollisionData) {
        var collider: ICollidableTyped = <ICollidableTyped>data.With;
        this.targetedPlayer = (<Player>collider);
        if (collider.collisionType == CollisionType.Player && !this.attacking) {
            var xSide: number = this.movementController.Position.X - (<Player>collider).movementController.Position.X;
            var ySide: number = this.movementController.Position.Y - (<Player>collider).movementController.Position.Y;
            var rotation: number = Math.atan2(xSide, ySide);
            this.movementController.Rotation = -rotation;
            this.movementController.Position.X -= this.speed * Math.sin(rotation);
            this.movementController.Position.Y -= this.speed * Math.cos(rotation);
            
           
        }
        if (collider.collisionType == CollisionType.Player && !this.IsCollidingWith(collider)) {
            this.attacking = false;
        }
    }

    Collided(data: eg.Collision.CollisionData) {
        var collider: ICollidableTyped = <ICollidableTyped>data.With;

        if (collider.collisionType == CollisionType.Wall) {
            var tempPostion = this.movementController.Position.Clone();
            var depth: eg.Vector2d = BoundsHelper.GetIntersectionDepth(this.Bounds, collider.Bounds);
            if (Math.abs(depth.Y) < Math.abs(depth.X)) {
                this.movementController.Position = new eg.Vector2d(this.movementController.Position.X, tempPostion.Y + depth.Y);
            }
            else {
                this.movementController.Position = new eg.Vector2d(tempPostion.X + depth.X, this.movementController.Position.Y);

            }
        }
        if (collider.collisionType == CollisionType.Player) {
            this.attacking = true;
            
        }
    }

   
    Update(gameTime: eg.GameTime) {
        this.movementController.Update(gameTime);
        this.attackTimer += gameTime.Elapsed.Seconds;
        if (this.attacking && this.attackTimer > 60/ this.attackspeed) {
            this.targetedPlayer.TakeDamage(this.damage);
        }
    }


}

