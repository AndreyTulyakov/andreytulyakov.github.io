
function get_world() {

    let world = get_base_world_template();

    world.models_root_path = 'models/';
    world.models_path = {
        tovarish: 'tovarish.FBX'
    };


    world.init = function () {
        scene.add(world.models.tovarish);
    };

    world.update = function () {
        // Do nothing - Template
    };

    return world;
}