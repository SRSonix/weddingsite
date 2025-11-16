import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider"
import { InfoService, type PaymentDetails } from "~/services/infoService";


export function GiftInfo() {
  const {t} = useTranslation(["gifts", "common"]);
    const {user} = useUser();
    const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | undefined>(undefined);

    useEffect(() => {
        if (user !== undefined) {
            InfoService.getPaymentDetails().then((paymentDetails) => {
                setPaymentDetails(paymentDetails)
            })
        }
    }, [user])

    return <div>
        <div className="mb-2">{t("no_physical_gifts")}</div>
        <div className="mb-2">{t("no_gift_required")}</div> 
        <div className="mb-2">{t("gifts_explain")}</div>
        <div className="mb-6">{t("gifts_payment")}</div>

        {paymentDetails !== undefined && <div>
            <div>
                <h4>PayPal</h4> 
                <p><span className="font-bold">mail</span>: <a href={`https://www.paypal.com/paypalme/${paymentDetails.paypal.username}`} target="_blank" className="text-interact">{paymentDetails.paypal.mail}</a></p>
            </div>

            <div className="mt-2">
                <h4>{t("bank_details")}</h4>
                <div>
                    <p><span className="font-bold min-w-24 inline-block" >{t("beneficiary")}</span>: {paymentDetails.bank.name}</p>
                    <p><span className="font-bold min-w-24 inline-block">IBAN</span>: {paymentDetails.bank.iban}</p>
                    <p><span className="font-bold min-w-24 inline-block">BIC/SWIFT</span>: {paymentDetails.bank.bic}</p>
                </div>
            </div>
        </div>
        }
    </div>
}