import { useEffect, useState, type ChangeEvent } from "react";
import { useTranslation } from "react-i18next";
import { Attandance, FamilyMemberType, FamilyMemberUpdate } from "~/services/userService";

function AttendanceSlider({ value, onChange, disabled, error }: {
    value: Attandance | undefined,
    onChange: (value: Attandance) => void,
    disabled: boolean,
    error?: boolean,
}) {
    const { t } = useTranslation("app");

    const options: { value: Attandance, label: string, icon: string, activeClass: string }[] = [
        { value: Attandance.will_not_join, label: t("no", "No"),    icon: "✗", activeClass: "bg-red-400 text-white" },
        { value: Attandance.undecided,     label: t("maybe", "Maybe"), icon: "?", activeClass: "bg-amber-400 text-white" },
        { value: Attandance.will_join,     label: t("yes", "Yes"),  icon: "✓", activeClass: "bg-olive-500 text-white" },
    ];

    const borderColor = error ? "border-red-500" : "border-olive-300";

    return (
        <div className={`flex rounded-lg overflow-hidden border max-w-64 ${borderColor} ${disabled ? "pointer-events-none" : ""}`}>
            {options.map((option, i) => (
                <button
                    key={option.value}
                    type="button"
                    onClick={() => onChange(option.value)}
                    className={[
                        "flex-1 py-0.5 px-2 text-sm flex items-center justify-center gap-1 transition-colors",
                        i > 0 ? `border-l ${borderColor}` : "",
                        value === option.value
                            ? option.activeClass
                            : disabled
                                ? "bg-transparent text-olive-300"
                                : "bg-white hover:bg-olive-50 text-olive-700",
                    ].join(" ")}
                >
                    <span aria-hidden="true">{option.icon}</span>
                    <span>{option.label}</span>
                </button>
            ))}
        </div>
    );
}

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
        <div className="flex flex-wrap gap-2 w-full">
            <div className="flex-grow min-w-36">
                <div className="flex align-center w-full">
                    <label htmlFor="name">{t("name", "Name")}</label>:<br/>
                    <input disabled={!edit} placeholder={t("name", "Name")} value={formData.name ?? ""} id="name" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "") + (errors.name ? " border-red-500" : "")}/>
                </div>
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>
            <div className="shrink-0">
                <div className="flex align-center">
                    <label htmlFor="type">{t("member_type", "Age Group")}</label>:<br/>
                    <select disabled={!edit} value={formData.type ?? ""} id="type" onChange={handleChange} className={"ml-1 " + (edit ? "input-inline" : "appearance-none") + (errors.type ? " border-red-500" : "")}>
                        <option disabled value="">{t("please_select", "Please select")}</option>
                        <option value={FamilyMemberType.adult}>{t("adult", "Adult")}</option>
                        <option value={FamilyMemberType.child}>{t("child", "Child")}</option>
                        <option value={FamilyMemberType.infant}>{t("infant", "Infant")}</option>
                    </select>
                </div>
                <p className="text-xs text-olive-500 mt-0.5">{t("companions_children", "Age groups: Infant (0-3), Child (4-12), Adult (13+).")}</p>
                {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
        </div>
        {!isNew && <>
            <div className="mt-3 pt-3 border-t border-olive-200">
                <div className="flex items-center gap-2">
                    <label className="shrink-0">{t("attendance", "Attendance")}:</label>
                    <AttendanceSlider
                        value={formData.attendance}
                        onChange={(v) => setFormData((prev) => ({ ...prev, attendance: v }))}
                        disabled={!edit}
                        error={!!errors.attendance}
                    />
                </div>
                {errors.attendance && (
                    <p className="text-red-500 text-sm mt-0.5">{errors.attendance}</p>
                )}
            </div>
        </>}
        <div className="flex align-center w-full mt-3 pt-3 border-t border-olive-200">
            <label htmlFor="diet">{t("diet", "Diet")}</label>:<br/>
            <input disabled={!edit} placeholder={t("diet_placeholder", "No allergies / preferences")} value={formData.diet ?? ""} id="diet" onChange={handleChange} className={"flex-grow ml-1 min-w-0 " + (edit ? "input-inline" : "")}/>
        </div>
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
