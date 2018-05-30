
function get_world() {

    let world = get_base_world_template();

    world.models_root_path = 'models/';
    world.models_path = {
        forest_scene: 'forest_scene.FBX'
    };


    world.init = function () {
        //world.models.forest_scene.position.y = 20;
        world.models.forest_scene.scale.set(0.2,0.2,0.2);

        let materials = findAllMaterialsInObjectByName(world.models.forest_scene, '', []);
        for (let i = 0; i < materials.length; i++) {
            materials[i].transparent = true;
            materials[i].needsUpdate = true;
        }

        console.log('world.models.forest_scene:', world.models.forest_scene);
        scene.add(world.models.forest_scene);
    };

    world.update = function () {
        // Do nothing - Template
    };

    return world;
}