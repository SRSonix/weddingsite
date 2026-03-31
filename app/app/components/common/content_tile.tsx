import { useTranslation } from "react-i18next";

export function ContentTile({children, header = undefined, id = undefined, fullWidth = false}: {children: React.ReactNode, header?: string, id?: string, fullWidth?: boolean}){
    const {t} = useTranslation();

    return (
        <div className={`${fullWidth ? "w-full" : "lg:flex-1 max-lg:w-full"} float inline-block p-3 border-solid border-2 rounded-xl border-olive-600/70`} id={id}>
            {header !== undefined && <h3 className="text-xl mb-2 mt-3">{header}</h3>}
            {children}
        </div>
    )
}