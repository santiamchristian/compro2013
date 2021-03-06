class MapHandler {
    private mapLayers: eg.Graphics.SquareTileMap[];
    private Scene: eg.Rendering.Scene2d
    private collisionManager: eg.Collision.CollisionManager;
    private propertyHooks: eg.MapLoaders.IPropertyHooks;
    enemies: Enemy[];
    loadingScreen: LoadingScreen;
    zone: string;
    players: Player[];
    items: Item[];
    public entrances: Entrance[];
    public walls: Wall[];
    input: eg.Input.InputManager;
    music: eg.Sound.AudioClip;
    

    constructor(Scene: eg.Rendering.Scene2d, collisionManager: eg.Collision.CollisionManager, input: eg.Input.InputManager) {
        this.mapLayers = new Array<eg.Graphics.SquareTileMap>();
        this.Scene = Scene;
        this.collisionManager = collisionManager;
        this.enemies = [];
        this.players = [];
        this.items = [];
        this.walls = new Array();
        this.entrances = new Array();
        this.input = input;
        this.propertyHooks = {
            ResourceTileHooks: {
                "entrance": this.createEntrance.bind(this), "spawn": this.spawn.bind(this), "spawnBoss": this.spawnBoss.bind(this), "item": this.spawnItem.bind(this) },
            ResourceSheetHooks: { "impassable": this.createCollisionMap.bind(this)  },
            LayerHooks: {}
        };
        
        this.loadingScreen = new LoadingScreen(this.Scene);
        
        
    }

    public mapLoadTick(percent: number) {
        this.loadingScreen.tick(percent);
    }
    
    public load(url: string): void {
        
        $.getJSON(url, (mapJson) => {
            var preloadInfo = eg.MapLoaders.JSONLoader.Load(mapJson,
                (result: eg.MapLoaders.IMapLoadedResult) => {
                    this.loadLayers((<eg.Graphics.SquareTileMap[]>result.Layers))
                    this.loadComplete();
                }, this.propertyHooks);
            preloadInfo.OnPercentLoaded.Bind(this.mapLoadTick.bind(this));
        }).fail((d, textStatus, error) => {
                console.error("getJSON failed, status: " + textStatus + ", error: " + error)
        });

        if (this.music) {
            this.music.Stop();
            this.music.Dispose();

        }

        if (url.indexOf("OverWorld") > -1)
            this.music = new eg.Sound.AudioClip("Resources/Audio/Music/Dungeon.mp3", new eg.Sound.AudioSettings(true, 50, true));
        else
            this.music = new eg.Sound.AudioClip("Resources/Audio/Music/Dub.mp3", new eg.Sound.AudioSettings(true, 50, true));
    }

    public loadComplete() {
        this.loadingScreen.clearScreen();
        this.music.Play();
    }

    public loadNewMap(url: string) {
        this.loadingScreen.StartLoad();
        this.unloadMap();
        this.load(url);;

        
    }

    public unloadMap() {
        for (var i in this.walls) {
            this.walls[i].Dispose();
        }
        for (var i in this.entrances) {
            this.entrances[i].Dispose();
        }
        for (var i in this.mapLayers) {
            this.mapLayers[i].Dispose();
        }
        while (this.enemies.length > 0) {
            this.enemies[this.enemies.length-1].Dispose();
        }
        while (this.items.length > 0) {
            this.items[this.items.length - 1].Dispose();
        }

        this.enemies = [];
        this.walls = [];
        this.entrances = [];
        this.mapLayers = [];
        this.items = [];
        
    }

    private loadLayers(layers: eg.Graphics.SquareTileMap[]): void {
        // Clear all existing layers (so we can click more than once)
        for (var i = 0; i < this.mapLayers.length; i++) {
            this.Scene.Remove(this.mapLayers[i]);
        }

        if (layers) {
            this.mapLayers = layers;
        }

        // Add all of the layers to the scenery (so they're drawn)
        for (var i = 0; i < this.mapLayers.length; i++) {
            this.Scene.Add(this.mapLayers[i]);
        }
    }

    private createCollisionMap(details: eg.Graphics.Assets.ITileDetails, propertyValue: string){
        var tile: eg.Graphics.Sprite2d = details.Tile;
        //create collision boxes for tiles that are not passable
        this.walls.push(new Wall(tile.Position, tile.Size.Subtract(1), this.Scene, this.collisionManager));
    }
    private createEntrance(details: eg.Graphics.Assets.ITileDetails, propertyValue: string) {
        var tile: eg.Graphics.Sprite2d = details.Tile;
        this.entrances.push(new Entrance(tile.Position, "Source/Map/Maps/" + propertyValue +".json", this, this.collisionManager));
    }

    private spawn(details: eg.Graphics.Assets.ITileDetails, propertyValue: string) {
        var tile: eg.Graphics.Sprite2d = details.Tile;
        if (propertyValue == "Player") {
            if (this.players.length > 0) {
                for (var i in this.players) { 
                this.players[i].movementController.Position = tile.Position.Clone();
                    this.players[i].spawnPoint = tile.Position.Clone();
                    this.players[i].pet.movementController.Position = tile.Position.Clone();
                    }
            }
            else {
                this.players.push(new Player(tile.Position.X, tile.Position.Y, ["Up", "W"], ["Down", "S"], ["Left", "A"], ["Right", "D"], this.input, this.Scene, this.collisionManager, this.items));

            }

        } else {

            if (Math.random() > .95) {
                var tempEnemy: Enemy = new window[propertyValue](tile.Position.X, tile.Position.Y, this.Scene, this.collisionManager, this.enemies, this.items);
                if (tempEnemy.collisionType == CollisionType.Enemy) 
                    this.enemies.push(tempEnemy);
            }
        }
    }

    private spawnBoss(details: eg.Graphics.Assets.ITileDetails, propertyValue: string) {
        var tile: eg.Graphics.Sprite2d = details.Tile;

        var tempEnemy: Enemy = new window[propertyValue](tile.Position.X, tile.Position.Y, this.Scene, this.collisionManager, this.enemies, this.items, this);
        if (tempEnemy.collisionType == CollisionType.Enemy)
            this.enemies.push(tempEnemy);
    }

    private spawnItem(details: eg.Graphics.Assets.ITileDetails, propertyValue: string) {
        var tile: eg.Graphics.Sprite2d = details.Tile;

        var tempItem: Item = new window[propertyValue](tile.Position.X, tile.Position.Y, this.Scene, this.collisionManager, this.items);
        if (tempItem.collisionType == CollisionType.Item) {
            tempItem.generatePrice();
            this.items.push(tempItem);
        }
    }

    public Update(gameTime: eg.GameTime) {
        
        this.loadingScreen.Update(gameTime);
        
        if (!this.loadingScreen.loading) {

            for (var index in this.players) {
                this.players[index].Update(gameTime);
            }

            for (var i in this.enemies) {
                this.enemies[i].Update(gameTime, this.players);



            }
        } 



        
    }


}