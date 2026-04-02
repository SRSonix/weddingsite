import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { FamilyMember, FamilyMemberCore } from "~/services/userService";

export function FamilyMemberItem({familyMember, updateCallback, deleteCallback}:{familyMember:FamilyMember, updateCallback: (id: number, data: FamilyMemberCore) => void, deleteCallback: (id: number) => void}){
    function updateFamilyMember(coreData: FamilyMemberCore){
        updateCallback(familyMember.id, coreData);
    }

    return (
        <div className="bg-olive-50 border border-olive-100 rounded-lg p-4 shadow-sm">
            <FamilyMemberForm id={familyMember.id} defaultData={familyMember.getFamilyMemberCore()} submitChanges={updateFamilyMember} deleteCallback={() => deleteCallback(familyMember.id)}></FamilyMemberForm>
        </div>
    );
}

export function FamilyMemberForm({id, defaultData, submitChanges, cancelCallback, deleteCallback}: {id: number | undefined, defaultData: FamilyMemberCore, submitChanges: (coreData: FamilyMemberCore)=>void, cancelCallback?: ()=>void, deleteCallback?: ()=>void}){
    const {t} = useTranslation("app");
    const [edit, setEdit] = useState(false);
    const [formData, setFormData] = useState<FamilyMemberCore>(FamilyMemberCore.getEmpty());
    const [errors, setErrors] = useState<Partial<Record<keyof FamilyMemberCore, string>>>({});

    useEffect(() => {
        setFormData(defaultData);
        setErrors({});
        setEdit(id===undefined);
    }, [defaultData])

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
        const id = e.target.id
        let new_value: any =  e.target.value;

        if (id !== "diet") {
            new_value = (e.target.value !== "" ? e.target.value : undefined);
        }
        if (id==="is_child" && new_value !== undefined){
            new_value = (new_value==="true");
        }
        setFormData((prev) => ({...prev, [id]: new_value}));
    }

    function cancel(){
        setFormData(defaultData);
        setErrors({});
        setEdit(false);
        cancelCallback?.();
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof FamilyMemberCore, string>> = {};
        if (!formData.name?.trim()) newErrors.name = t("error_name_required", "Name is required");
        if (formData.is_child === undefined) newErrors.is_child = t("error_please_select", "Please select");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(){
        if (validate()) submitChanges(formData);
    }

    return <div>
        <div className="flex align-center w-full">
            <label htmlFor="name">{t("name", "Name")}</label>:<br/>
            <input disabled={!edit} placeholder={t("name", "Name")} value={formData.name == undefined ? "": formData.name} id="name" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ?"input-inline" : "") + (errors.name ? " border-red-500" : "")}/>
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <div className="flex align-center w-full">
            <label htmlFor="diet">{t("diet", "Diet")}</label>:<br/>
            <input disabled={!edit} placeholder={t("diet_placeholder", "No allergies / preferences")} value={formData.diet == undefined ? "": formData.diet} id="diet" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ?"input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="is_child">{t("is_child", "Child")}</label>:<br/>
            <select disabled={!edit} value={formData.is_child == undefined ? "": formData.is_child.toString()} id="is_child" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ?"input-inline" : "appearance-none") + (errors.is_child ? " border-red-500" : "")}>
                <option disabled value={""}>{t("please_select", "Please select")}</option>
                <option value={"true"}>{t("yes", "Yes")}</option>
                <option value={"false"}>{t("no", "No")}</option>
            </select>
        </div>
        {errors.is_child && <p className="text-red-500 text-sm">{errors.is_child}</p>}
        <div className="pt-3 flex flex-wrap items-center gap-2">
            {!edit && <button onClickCapture={() => setEdit(true)} className="btn btn-small">
                {t("edit", "Edit")}
            </button>}
            {edit && <button onClickCapture={handleSubmit} className="btn btn-green btn-small">
                {t("save", "Save")}
            </button>}
            {edit && <button onClickCapture={cancel} className="btn btn-small">
                {t("cancel", "Cancel")}
            </button>}
            {edit && id !== undefined && deleteCallback && (
                <button onClickCapture={deleteCallback} className="btn btn-red btn-small ml-auto">
                    {t("delete_person", "Remove person")}
                </button>
            )}
        </div>
    </div>
}
