import { useMemo, useState } from "react"
import { IoHelpCircleOutline } from "react-icons/io5"
import RaContainer from "../../../../components/container/RaContainer"
import RaContainerPadding from "../../../../components/container/RaContainerPadding"
import RaBreadcrumb from "../../../../components/breadcrumb/RaBreadcrumb"
import RaCard from "../../../../components/card/RaCard"
import RaSearchBar from "../../../../components/searchbar/RaSearchbar"
import RaButton from "../../../../components/button/RaButton"
import { HELP_TOPICS } from "../../../../lib/helpGuides"
import { openHelp } from "../../../../store/helpStore"

function HelpCenter() {
  const [query, setQuery] = useState("")
  const [openId, setOpenId] = useState(HELP_TOPICS[0]?.id ?? "")

  const topics = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return HELP_TOPICS
    return HELP_TOPICS.filter((topic) =>
      `${topic.title} ${topic.summary} ${topic.steps.join(" ")}`.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <RaContainer>
      <RaContainerPadding>
        <div className="max-w-2xl mx-auto flex flex-col gap-6 pb-24">
          <RaBreadcrumb items={[{ label: "Help" }]} />
          <div className="flex items-start gap-3">
            <IoHelpCircleOutline className="size-8 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-xl md:text-2xl font-bold">Help & guides</div>
              <p className="text-sm md:text-base font-light text-muted">
                Short walkthroughs for renting, listing, payments, and account setup. The help icon on each page opens the matching guide.
              </p>
            </div>
          </div>
          <RaSearchBar
            placeholderText="Search guides…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            suggestions={false}
          />
          {topics.length === 0 ? (
            <div className="text-sm text-muted">No guides match that search.</div>
          ) : (
            topics.map((topic) => {
              const expanded = openId === topic.id
              return (
                <RaCard key={topic.id} round="round" styleClass="flex flex-col gap-3">
                  <button
                    type="button"
                    className="text-left cursor-pointer"
                    onClick={() => setOpenId(expanded ? "" : topic.id)}
                  >
                    <div className="font-semibold">{topic.title}</div>
                    <div className="text-sm text-muted">{topic.summary}</div>
                  </button>
                  {expanded ? (
                    <>
                      <ol className="flex flex-col gap-1 list-decimal pl-5 text-sm">
                        {topic.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ol>
                      {topic.tips?.map((tip) => (
                        <p key={tip} className="text-sm text-primary bg-accent rounded-xl px-3 py-2">{tip}</p>
                      ))}
                      <RaButton
                        type="button"
                        btnText="Open as popup"
                        variant="outline"
                        widthFill={false}
                        clickFunc={() => openHelp(topic.id)}
                      />
                    </>
                  ) : null}
                </RaCard>
              )
            })
          )}
        </div>
      </RaContainerPadding>
    </RaContainer>
  )
}

export default HelpCenter
