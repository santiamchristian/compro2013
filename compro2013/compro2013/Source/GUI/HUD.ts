class HUD {
    score: eg.Graphics.Text2d;
    scorePosition: eg.Vector2d;

    fps: eg.Graphics.Text2d;
    fpsPosition: eg.Vector2d;

    health: eg.Graphics.Text2d;
    healthPosition: eg.Vector2d;

    scene: eg.Rendering.Scene2d;
    inventorySprites: eg.Graphics.Sprite2d;
    backgroundImage: eg.Graphics.Sprite2d;

    constructor(scene: eg.Rendering.Scene2d) {
        this.scene = scene;

        this.scorePosition = new eg.Vector2d(50, 50);
        this.score = new eg.Graphics.Text2d(this.scene.Camera.TopLeft.X + this.scorePosition.X, this.scene.Camera.TopLeft.Y + this.scorePosition.Y, "Score: ");
        this.score.Scale(3);
        this.score.ZIndex = ZIndexing.HUD;
        this.scene.Add(this.score);
        
        //FPS Text only enabled when debug is on
        if (Game.DEBUG) {
            this.fpsPosition = new eg.Vector2d(20, 20);
            this.fps = new eg.Graphics.Text2d(this.scene.Camera.TopLeft.X + this.fpsPosition.X, this.scene.Camera.TopLeft.Y + this.fpsPosition.Y, "FPS", eg.Graphics.Color.White);
            this.fps.ZIndex = 10;
            this.scene.Add(this.fps);
        }
        this.healthPosition = new eg.Vector2d(-50, -50);
        this.health = new eg.Graphics.Text2d(this.scene.Camera.BotLeft.X + this.scorePosition.X, this.scene.Camera.BotLeft.Y + this.scorePosition.Y, "Score: ");
        this.health.Scale(3);
        this.health.ZIndex = ZIndexing.HUD;
        this.scene.Add(this.health);

        
    }

    Update(gameTime: eg.GameTime, score: number, health: number) {
        this.score.Position = this.scene.Camera.TopLeft.Add(this.scorePosition);
        this.score.Text = "Score: " + score;

        //FPS Text
        if (Game.DEBUG) {
            this.fps.Position = this.scene.Camera.TopLeft.Add(this.fpsPosition);
            this.fps.Text = "FPS: " + Math.round(1000 / gameTime.Elapsed.Milliseconds);
        }

        this.health.Position = this.scene.Camera.BotLeft.Add(this.healthPosition);
        this.health.Text = "Health: " + health;
    }
}
