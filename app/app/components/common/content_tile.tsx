import { useTranslation } from "react-i18next";

export function ContentTile({children, header}: {children: React.ReactNode, header: string | undefined}){
    const {t} = useTranslation();

    return (
        <div className="lg:flex-1 max-lg:w-full mr-3 mb-3 float inline-block p-3 border-solid border-2 rounded-xl border-yellow-700/70">
            {header !== undefined && <h3 className="text-xl mb-2 mt-3">{header}</h3>}
            {children}
        </div>
    )
}