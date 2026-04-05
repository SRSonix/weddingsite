import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attandance, FamilyMemberType, FamilyMemberUpdate } from "~/services/userService";


export function FamilyMemberForm({id, defaultData, submitChanges, cancelCallback, deleteCallback}: {
    id?: number,
    defaultData: FamilyMemberUpdate,
    submitChanges: (data: FamilyMemberUpdate) => void,
    cancelCallback?: () => void,
    deleteCallback?: () => void,
}){
    const {t} = useTranslation("app");
    const isNew = id === undefined;
    const [edit, setEdit] = useState(isNew);
    const [formData, setFormData] = useState<FamilyMemberUpdate>(defaultData);
    const [errors, setErrors] = useState<Partial<Record<keyof FamilyMemberUpdate, string>>>({});

    useEffect(() => {
        setFormData(defaultData);
        setErrors({});
        if (!isNew) setEdit(false);
    }, [defaultData])

    function handleChange(e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>){
        const key = e.target.id;
        let value: any = e.target.value;
        if (key !== "diet") value = value !== "" ? value : undefined;
        if (key === "type" && value) value = value as FamilyMemberType;
        if (key === "attendance" && value) value = value as Attandance;
        setFormData((prev) => ({...prev, [key]: value}));
    }

    function cancel(){
        setFormData(defaultData);
        setErrors({});
        setEdit(false);
        cancelCallback?.();
    }

    function validate(): boolean {
        const newErrors: Partial<Record<keyof FamilyMemberUpdate, string>> = {};
        if (!formData.name?.trim()) newErrors.name = t("error_name_required", "Name is required");
        if (!formData.type) newErrors.type = t("error_please_select", "Please select");
        if (!isNew && !formData.attendance) newErrors.attendance = t("error_please_select", "Please select");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(){
        if (!validate()) return;
        submitChanges(formData);
        if (!isNew) setEdit(false);
    }

    return <div>
        <div className="flex align-center w-full">
            <label htmlFor="name">{t("name", "Name")}</label>:<br/>
            <input disabled={!edit} placeholder={t("name", "Name")} value={formData.name ?? ""} id="name" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "") + (errors.name ? " border-red-500" : "")}/>
        </div>
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        <div className="flex align-center w-full">
            <label htmlFor="diet">{t("diet", "Diet")}</label>:<br/>
            <input disabled={!edit} placeholder={t("diet_placeholder", "No allergies / preferences")} value={formData.diet ?? ""} id="diet" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "")}/>
        </div>
        <div className="flex align-center w-full">
            <label htmlFor="type">{t("member_type", "Type")}</label>:<br/>
            <select disabled={!edit} value={formData.type ?? ""} id="type" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "appearance-none") + (errors.type ? " border-red-500" : "")}>
                <option disabled value="">{t("please_select", "Please select")}</option>
                <option value={FamilyMemberType.adult}>{t("adult", "Adult")}</option>
                <option value={FamilyMemberType.child}>{t("child", "Child")}</option>
                <option value={FamilyMemberType.infant}>{t("infant", "Infant")}</option>
            </select>
        </div>
        {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
        {!isNew && <>
            <div className="flex align-center w-full">
                <label htmlFor="attendance">{t("attendance", "Attendance")}</label>:<br/>
                <select disabled={!edit} value={formData.attendance ?? ""} id="attendance" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "appearance-none") + (errors.attendance ? " border-red-500" : "")}>
                    <option disabled value="">{t("not_set", "Not set")}</option>
                    <option value={Attandance.undecided}>{t(Attandance.undecided, "Undecided")}</option>
                    <option value={Attandance.will_join}>{t(Attandance.will_join, "I will join the wedding!")}</option>
                    <option value={Attandance.will_not_join}>{t(Attandance.will_not_join, "I will not be able to join.")}</option>
                </select>
            </div>
            {errors.attendance && <p className="text-red-500 text-sm">{errors.attendance}</p>}
        </>}
        <div className="pt-3 flex flex-wrap items-center gap-2">
            {!edit && <button onClickCapture={() => setEdit(true)} className="btn btn-small">{t("edit", "Edit")}</button>}
            {edit && <button onClickCapture={handleSubmit} className="btn btn-green btn-small">{t("save", "Save")}</button>}
            {edit && <button onClickCapture={cancel} className="btn btn-small">{t("cancel", "Cancel")}</button>}
            {deleteCallback && (
                <button onClickCapture={deleteCallback} className="btn btn-red btn-small ml-auto">
                    {t("delete_person", "Remove person")}
                </button>
            )}
        </div>
    </div>
}
