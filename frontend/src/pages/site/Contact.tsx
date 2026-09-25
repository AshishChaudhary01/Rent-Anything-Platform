import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { IoCallOutline, IoLocationOutline, IoMailOutline, IoPersonOutline, IoTimeOutline } from "react-icons/io5"
import { useMutation } from "@tanstack/react-query"
import SiteLayout from "../../layouts/SiteLayout"
import SiteHero from "./SiteHero"
import RaCard from "../../components/card/RaCard"
import RaContainer from "../../components/container/RaContainer"
import RaContainerPadding from "../../components/container/RaContainerPadding"
import RaButton from "../../components/button/RaButton"
import RaInput from "../../components/input/RaInput"
import { SITE_CONTACT } from "../../data/siteContact"
import { raToast } from "../../lib/raToast"
import { applyApiFieldErrors } from "../../lib/formErrors"
import { submitContact } from "../../services/contact.service"
import { requiredEmail, requiredString } from "../../schemas/zod.schema"

const contactBody = z.object({
  name: requiredString("full name"),
  email: requiredEmail(),
  message: z.string().trim().min(1, "Provide a message").max(2000, "Message is too long"),
})

type ContactForm = z.infer<typeof contactBody>

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactForm>({
    resolver: zodResolver(contactBody),
    defaultValues: { name: "", email: "", message: "" },
  })

  const { mutate, isPending } = useMutation({
    mutationFn: submitContact,
    onSuccess: (result) => {
      reset()
      raToast.success(
        result.emailed
          ? "Message sent. We emailed a copy to you."
          : "Message received. We will get back to you by email.",
      )
    },
    onError: (error) => {
      applyApiFieldErrors(setError, error, "message")
      raToast.fromError(error, "Could not send your message.")
    },
  })

  return (
    <SiteLayout>
      <SiteHero
        kicker="CONTACT"
        title="We're here to help"
        lead="Whether you are listing a first item or stuck on a rental, the RAP team in Kathmandu can point you to the right next step."
      />

      <section className="pb-16">
        <RaContainer>
          <RaContainerPadding>
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              <RaCard round="round" styleClass="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Get in touch</h2>
                <p className="text-sm text-muted">
                  Send a message and we will store it for the RAP team. If email is configured, you also get a copy at the address you enter.
                </p>
                <form className="flex flex-col gap-3" onSubmit={handleSubmit((data) => mutate(data))}>
                  <RaInput
                    type="text"
                    label="Full name"
                    name="name"
                    placeholderText="Your name"
                    Icon={IoPersonOutline}
                    registration={register("name")}
                    error={errors.name?.message}
                  />
                  <RaInput
                    type="email"
                    label="Email"
                    name="email"
                    placeholderText="you@example.com"
                    Icon={IoMailOutline}
                    registration={register("email")}
                    error={errors.email?.message}
                  />
                  <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium">Message</span>
                    <textarea
                      rows={5}
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-base outline-none focus:border-primary"
                      {...register("message")}
                    />
                    {errors.message?.message ? (
                      <span className="text-danger text-xs">{errors.message.message}</span>
                    ) : null}
                  </label>
                  <RaButton
                    type="submit"
                    btnText={isPending ? "Sending…" : "Send message"}
                    disabled={isSubmitting || isPending}
                    loading={isPending}
                  />
                </form>
              </RaCard>

              <div className="flex flex-col gap-4">
                <RaCard bg="surface" round="round" styleClass="flex gap-3 items-start">
                  <IoLocationOutline className="size-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Office address</div>
                    <p className="text-sm text-muted">
                      {SITE_CONTACT.addressLine1}
                      <br />
                      {SITE_CONTACT.addressLine2}
                    </p>
                  </div>
                </RaCard>
                <RaCard bg="surface" round="round" styleClass="flex gap-3 items-start">
                  <IoMailOutline className="size-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Support email</div>
                    <a className="text-sm text-primary" href={`mailto:${SITE_CONTACT.supportEmail}`}>
                      {SITE_CONTACT.supportEmail}
                    </a>
                    <div className="text-sm text-muted mt-1">General: {SITE_CONTACT.email}</div>
                  </div>
                </RaCard>
                <RaCard bg="surface" round="round" styleClass="flex gap-3 items-start">
                  <IoCallOutline className="size-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Phone</div>
                    <a className="text-sm text-primary" href={`tel:${SITE_CONTACT.phone.replace(/\s/g, "")}`}>
                      {SITE_CONTACT.phone}
                    </a>
                  </div>
                </RaCard>
                <RaCard bg="surface" round="round" styleClass="flex gap-3 items-start">
                  <IoTimeOutline className="size-6 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Hours</div>
                    <p className="text-sm text-muted">{SITE_CONTACT.hours} (demo)</p>
                  </div>
                </RaCard>
              </div>
            </div>
          </RaContainerPadding>
        </RaContainer>
      </section>
    </SiteLayout>
  )
}

export default Contact
