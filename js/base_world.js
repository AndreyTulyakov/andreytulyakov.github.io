
function get_base_world_template() {

    let base_world = {

    };
    
    base_world.scene = null;
    base_world.controls = null;
    base_world.camera = null;
    base_world.models_path = {};
    base_world.models = {};
    base_world.textures = {};
    base_world.materials = {};

    base_world.init = function() {};


    base_world.is_loading_models_complete = function () {
        let counter = 0;
        for (let model_name in base_world.models_path) {
            if (base_world.models_path.hasOwnProperty(model_name)) {
                if (base_world.models_path[model_name] !== null) {
                    counter++;
                    break;
                }
            }
        }
        return counter === 0;
    };

    base_world.load_all_models = function (callback_func = null) {

        let fbx_loader = new THREE.FBXLoader();

        for (let model_name in base_world.models_path) {

            let model_file_path = base_world.models_root_path + base_world.models_path[model_name];

            console.log('Try to load model:', model_name, ':', model_file_path);
            base_world.load_model(fbx_loader, model_file_path, function (object) {
                    object.name = model_name;
                    base_world.models[model_name] = object;
                    base_world.models_path[model_name] = null;

                    if (base_world.is_loading_models_complete()) {
                        console.log('loading all 3D parts done!');

                        if (callback_func != null) {
                            callback_func();
                        }
                    }
                });
        }
    };

    base_world.load_model = function(loader, model_url, callback_func) {
        loader.load(CURRENT_PATH + model_url, function (object) {
    
            object.children.forEach(function(child) {
    
            });
            callback_func(object);
        });
    };




    return base_world;
}