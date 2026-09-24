import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { reportKeys } from "../../lib/queryKeys"
import { fetchMyReports, fetchReport, submitUserReport } from "../../services/chat.service"

export function useMyReports() {
  return useQuery({
    queryKey: reportKeys.mine(),
    queryFn: fetchMyReports,
  })
}

export function useReport(id: string | undefined) {
  return useQuery({
    queryKey: reportKeys.detail(id || ""),
    queryFn: () => fetchReport(id!),
    enabled: Boolean(id),
  })
}

export function useSubmitReport() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submitUserReport,
    onSuccess: (report) => {
      queryClient.invalidateQueries({ queryKey: reportKeys.all() })
      queryClient.setQueryData(reportKeys.detail(report.id), report)
    },
  })
}
