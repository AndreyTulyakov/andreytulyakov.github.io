
function clone(obj) {
    var copy;

    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        copy = [];
        for (var i = 0, len = obj.length; i < len; i++) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
}


// Delete model-object from scene
function removeEntityFromScene(object, scene) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
    animate();
}


// Скопировать некоторые специфические свойства модели
function clone_some_properties(object_from, object_to) {
    for (let i = 0; i < object_from.children.length; i++) {
        let obj = object_from.children[i];
        object_to.children[i].no_need_color = obj.no_need_color;
        if(object_from.hasOwnProperty('material')) {
            object_to.material = object_from.material.clone();
            object_to.material.map = object_from.material.map.clone();
        }
        if(object_from.hasOwnProperty('no_need_color')) {
            object_to.no_need_color = object_from.no_need_color;
        }
        
    }
}

function findParentPreSceneObject(scene, child) {
    
    let current_object = child;
    while(current_object.hasOwnProperty('parent')) {
        if(current_object.parent.hasOwnProperty('type') && current_object.parent.type != "Scene" ) {
            current_object = current_object.parent;
        } else {
            break;
        }
    }
    return current_object;
}


// Поиск объектов на сцене по имени. Возвращает список найденных.
function get_meshes_from_scene_by_name(scene, mesh_name) {

    let results = [];

    for (let i = 0; i < scene.children.length; i++) {
        let obj = scene.children[i];

        if (obj.is_model) {
            obj.children.forEach(function(child) {
                if(child.name == mesh_name) {
                    results.push(child);
                }
            });
        }
    }
    return results;
}

function get_objects_from_scene_startswith_name(scene, mesh_name) {

    let results = [];

    for (let i = 0; i < scene.children.length; i++) {
        let obj = scene.children[i];

        if (obj.is_model && obj.name.startsWith(mesh_name)) {
            results.push(obj);
        }
    }
    return results;
}

function setVisible(object, visible) {
    if(object.type == "Group") {
        for(let i = 0; i < object.children.length; i++) {
            setVisible(object.children[i], visible);
        }
    }

    if(object.type == "Mesh") {
        object.visible = visible;
    }
}

function setVisibleByName(object, name, visible) {
    if(object.type == "Group") {
        for(let i = 0; i < object.children.length; i++) {
            setVisible(object.children[i], name, visible);
        }
    }

    if(object.type == "Mesh" && object.name == name) {
        object.visible = visible;
    }
}

function getAllMeshesVisibleByName(object, name, visible) {
    if(object.type == "Group") {
        for(let i = 0; i < object.children.length; i++) {
            getAllMeshesVisibleByName(object.children[i], name, visible);
        }
    }

    if(object.type == "Mesh" && object.name == name) {
        object.visible = visible;
    }
}

function getAllMeshesFromObject(object, array) {
    if(object.type == "Group" && object.is_model) {
        for(let i = 0; i < object.children.length; i++) {
            getAllMeshesFromObject(object.children[i], array);
        }
    }

    if(object.type == "Mesh") {
        array.push(object);
    }

    return array;
}

function getAllMeshesListFromScene(scene_object) {
    let result_array = [];
    for(let i = 0; i < scene_object.children.length; i++) {
        result_array = result_array + getAllMeshesFromObject(scene_object.children[i], []);
    }
    return result_array;
}

function getAllFirstMeshesScene(scene) {
    let result_array = [];
    for(let i = 0; i < scene.children.length; i++) {
        let object = scene.children[i];
        
        for(let j = 0; j < object.children.length; j++) {
            result_array.push(object.children[j]);
        }
    }
    return result_array;
}


function getAllGroupsFromObject(start_object, object, array = []) {
    
    if(object.type == "Group" || object.type == "Scene") {
        if(object != start_object) {
            array.push(object);
        }

        for(let i = 0; i < object.children.length; i++) {
            getAllGroupsFromObject(start_object, object.children[i], array);
        }
    }
    return array;
}



function setMyParentForAllMeshes(object, parent) {

    if(object.type == "Group") {
        object.my_parent = parent;
        for(let i = 0; i < object.children.length; i++) {
            setMyParentForAllMeshes(object.children[i], parent);
        }
    }

    if(object.type == "Mesh") {
        object.my_parent = parent;
    }
}


function findAllMaterialsInObjectByName(object, name, m_array=[]) {
    if(object.type == "Group") {
        for(let i = 0; i < object.children.length; i++) {
            findAllMaterialsInObjectByName(object.children[i], name, m_array);
        }
    }

    if(object.type == "Mesh" && object.hasOwnProperty('material')) {
        if(Array.isArray(object.material)) {
            for(let m=0; m<object.material.length; m++) {
                if(object.material[m].hasOwnProperty('name') && object.material[m].name == name) {
                    m_array.push(object.material[m]);
                }
            }
        } else {
            if(object.material.hasOwnProperty('name') && object.material.name == name) {
                m_array.push(object.material);
            }
        }
    }

    return m_array;
}


function findAllMaterialsInObject(object,  m_array=[]) {
    if(object.type == "Group") {
        for(let i = 0; i < object.children.length; i++) {
            findAllMaterialsInObject(object.children[i], m_array);
        }
    }

    if(object.type == "Mesh" && object.hasOwnProperty('material')) {
        if(Array.isArray(object.material)) {
            for(let m=0; m<object.material.length; m++) {
                    m_array.push(object.material[m]);
            }
        } else {
                m_array.push(object.material);
        }
    }

    return m_array;
}

function getAllMeshesSceneByName(object, name, arr=[]) {

    if(object.hasOwnProperty('children')) {
        for(let i = 0; i < object.children.length; i++) {
            getAllMeshesSceneByName(object.children[i], name, arr);
        }
    }

    if(object.hasOwnProperty('name')) {
        if(object.name == name) {
            arr.push(object);
        }
    }

    return arr;
}