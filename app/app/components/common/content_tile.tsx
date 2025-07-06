import { useTranslation } from "react-i18next";

export function ContentTile({children, header}: {children: React.ReactNode, header: string | undefined}){
    const {t} = useTranslation();

    return (
        <div className="w-128 float inline-block m-3 p-3 border-solid border-2 rounded-xl border-yellow-700/70">
            {header !== undefined && <h3 className="text-xl mb-2 mt-3 text-yellow-800/80">{header}</h3>}
            {children}
        </div>
    )
}