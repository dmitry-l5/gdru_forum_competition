import { Character } from "../../Character"

export function UnitFactory(){ }

UnitFactory.build = function(unit_id, options, resourceLoader, scene ){
    const {metadata, position, savableData} = options;
    return new Promise((resolve, reject)=>{
        const unit = new Character(scene, position, {resourceLoader});
        const model_id = metadata.MODEL_ID;
        unit.init(model_id).then(()=>{
            console.log(`Character : ${unit_id} - instantiate`);    
            resolve(unit);     
        });

    });
}