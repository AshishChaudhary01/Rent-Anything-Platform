import { useState } from "react"
import { IoCheckmarkCircle, IoAddOutline } from "react-icons/io5"
import { raToast } from "../../../../lib/raToast"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaButton from "../../../../components/button/RaButton"
import RaInput from "../../../../components/input/RaInput"
import {
  availableWallets,
  initialLinkedWallets,
  type LinkedWallet,
  type WalletId,
} from "../../../../data/account"

function maskWallet(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length < 4) return phone
  return `${digits.slice(0, 2)}${"*".repeat(Math.max(0, digits.length - 4))}${digits.slice(-2)}`
}

function PaymentMethods() {
  const [wallets, setWallets] = useState<LinkedWallet[]>(initialLinkedWallets)
  const [adding, setAdding] = useState<WalletId | null>(null)
  const [walletPhone, setWalletPhone] = useState("")

  const unlinked = availableWallets.filter((w) => !wallets.some((linked) => linked.id === w.id))

  const setDefault = (id: WalletId) => {
    setWallets((prev) => prev.map((w) => ({ ...w, isDefault: w.id === id })))
    raToast.success("Default payment method updated")
  }

  const unlink = (id: WalletId) => {
    setWallets((prev) => {
      const next = prev.filter((w) => w.id !== id)
      if (next.length > 0 && !next.some((w) => w.isDefault)) {
        next[0] = { ...next[0], isDefault: true }
      }
      return next
    })
    raToast.success("Wallet unlinked")
  }

  const linkWallet = () => {
    if (!adding || walletPhone.replace(/\D/g, "").length < 10) {
      raToast.error("Enter a valid wallet mobile number")
      return
    }
    const meta = availableWallets.find((w) => w.id === adding)
    if (!meta) return
    setWallets((prev) => [
      ...prev.map((w) => ({ ...w, isDefault: prev.length === 0 ? false : w.isDefault })),
      {
        id: adding,
        label: meta.label,
        logo: meta.logo,
        accountHint: maskWallet(walletPhone),
        isDefault: prev.length === 0,
      },
    ])
    setAdding(null)
    setWalletPhone("")
    raToast.success(`${meta.label} linked. RAP will use it at checkout.`)
  }

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-xl mx-auto flex flex-col gap-y-6 pb-32">
          <RaBreadcrumb items={[{ label: "Payment methods" }]} />
          <div>
            <div className="text-xl md:text-2xl font-bold">Payment methods</div>
            <div className="text-sm md:text-base font-light text-muted">
              Link eSewa or Khalti once. Checkout uses your default wallet; you still confirm in the wallet app. RAP never stores your wallet password.
            </div>
          </div>

          {wallets.length === 0 ? (
            <RaCard round="round" styleClass="text-sm text-muted">
              No wallet linked yet. Add one so commitment fees and deposits are one tap.
            </RaCard>
          ) : (
            <div className="flex flex-col gap-3">
              {wallets.map((wallet) => (
                <RaCard key={wallet.id} round="round" styleClass="flex flex-col gap-3 p-4!">
                  <div className="flex items-center gap-3">
                    <img src={wallet.logo} alt="" className="size-12 rounded-full object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {wallet.label}
                        {wallet.isDefault && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-muted">{wallet.accountHint}</div>
                    </div>
                    {wallet.isDefault && <IoCheckmarkCircle className="size-6 text-primary shrink-0" />}
                  </div>
                  <div className="flex gap-2">
                    {!wallet.isDefault && (
                      <RaButton
                        type="button"
                        btnText="Set default"
                        size="sm"
                        variant="outline"
                        widthFill={false}
                        clickFunc={() => setDefault(wallet.id)}
                      />
                    )}
                    <RaButton
                      type="button"
                      btnText="Unlink"
                      size="sm"
                      variant="danger"
                      widthFill={false}
                      clickFunc={() => unlink(wallet.id)}
                    />
                  </div>
                </RaCard>
              ))}
            </div>
          )}

          {unlinked.length > 0 && (
            <div className="flex flex-col gap-3">
              <div className="font-semibold">Add a wallet</div>
              {unlinked.map((wallet) => (
                <button
                  key={wallet.id}
                  type="button"
                  onClick={() => {
                    setAdding(wallet.id)
                    setWalletPhone("")
                  }}
                  className={`flex items-center gap-3 rounded-2xl p-4 bg-white border cursor-pointer ${adding === wallet.id ? "border-primary" : "border-gray-200"}`}
                >
                  <img src={wallet.logo} alt="" className="size-10 rounded-full object-cover" />
                  <span className="font-semibold flex-1 text-left">Link {wallet.label}</span>
                  <IoAddOutline className="size-5 text-primary" />
                </button>
              ))}
            </div>
          )}

          {adding && (
            <RaCard round="round" styleClass="flex flex-col gap-4">
              <div className="font-semibold">
                Link {availableWallets.find((w) => w.id === adding)?.label}
              </div>
              <p className="text-sm text-muted">
                Enter the mobile number on that wallet. You will approve the link in eSewa or Khalti. We do not ask for your PIN or password here.
              </p>
              <RaInput
                name="walletPhone"
                label="Wallet mobile number"
                placeholderText="9801234567"
                value={walletPhone}
                onChange={(e) => setWalletPhone(e.target.value)}
              />
              <RaButton type="button" btnText="Link wallet" clickFunc={linkWallet} />
            </RaCard>
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default PaymentMethods
