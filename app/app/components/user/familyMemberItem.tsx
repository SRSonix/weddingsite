import { useEffect, useState, type ChangeEvent } from "react";
import type { UserConfig } from "vite";
import { FamilyMember, FamilyMemberCore } from "~/services/userService";

export function FamilyMemberItem({familyMember, updateCallback, deleteCallback}:{familyMember:FamilyMember, updateCallback: (id: number, data: FamilyMemberCore) => void, deleteCallback: (id: number) => void}){
    function updateFamilyMember(coreData: FamilyMemberCore){
        updateCallback(familyMember.id, coreData);
    }

    return <div className="border-1 border-dotted">
        <FamilyMemberForm id={familyMember.id} defaultData={familyMember.getFamilyMemberCore()} submitChanges={updateFamilyMember}></FamilyMemberForm>
        <div className="pt-3">
              <button onClickCapture={()=>{deleteCallback(familyMember.id)}} className="btn btn-red btn-small">
                  delete person
              </button>
          </div>
    </div>
}

export function FamilyMemberForm({id, defaultData, submitChanges, cancelCallback}: {id: number | undefined, defaultData: FamilyMemberCore, submitChanges: (coreData: FamilyMemberCore)=>void, cancelCallback?: ()=>void}){
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<FamilyMemberCore>(FamilyMemberCore.getEmpty());

    useEffect(() => {
        setFormData(defaultData);
        setEdit(id===undefined);
    }, [defaultData])

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
        const id = e.target.id
        let new_value: any
        
        if (id !== "diet") {new_value = (e.target.value !== "" ?  e.target.value : undefined)}
        if (id==="is_child" && new_value !== undefined){
            new_value = (new_value==="true");
        }
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function cancel(){
        setFormData(defaultData);
        setEdit(false);
        cancelCallback?.();
    }

    // TODO: form validation and user feedback

    return <div>
         <div className="flex align-center w-full">
            <label htmlFor="diet">name</label>:<br/>
            <input disabled={!edit} placeholder="name" value={formData.name == undefined ? "": formData.name} id="name" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="diet">diet</label>:<br/>
            <input disabled={!edit} placeholder="diet" value={formData.diet == undefined ? "": formData.diet} id="diet" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="diet">is_child</label>:<br/>
            <select disabled={!edit} value={formData.is_child == undefined ? "": formData.is_child.toString()} id="is_child" onChange={handleChange} className={"flex-grow ml-1 " + (edit ? "input-inline" : "appearance-none")}>
                <option disabled value={""}>please_select</option>
                <option value={"true"}>True</option>
                <option value={"false"}>False</option>
            </select>        
        </div>
        <div className="pt-3">
        {!edit && <button onClickCapture={() => setEdit(true)} className="btn mr-2 btn-small">
            edit
        </button>} 
        {edit && <button onClickCapture={()=>submitChanges(formData)} className="btn btn-green mr-2 btn-small">
            submit
        </button>}
        {edit && <button onClickCapture={cancel} className="btn btn-red mr-2 btn-small">
            cancel
        </button>}
        </div>
    </div>
}
