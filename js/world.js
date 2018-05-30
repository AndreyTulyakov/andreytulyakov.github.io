
function get_world() {

    let world = get_base_world_template();

    world.models_root_path = 'models/';
    world.models_path = {
        forest_scene: 'forest_scene.FBX'
    };


    world.init = function () {
        world.models.forest_scene.position.y = 15;
        world.models.forest_scene.scale.set(0.2, 0.2, 0.2);

        let materials = findAllMaterialsInObject(world.models.forest_scene, []);
        //let materials = findAllMaterialsInObjectByName(world.models.forest_scene, 'Material__1', []);

        for (let i = 0; i < materials.length; i++) {
            materials[i].alphaTest = 0.1;
            materials[i].transparent = true;
            materials[i].needsUpdate = true;
            materials[i].depthTest = true;
            materials[i].depthWrite = true;
            materials[i].side = THREE.DoubleSide;
        }

        
        scene.add(world.models.forest_scene);
    };

    world.update = function () {
        // Do nothing - Template
    };

    return world;
}