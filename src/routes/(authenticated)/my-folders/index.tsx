import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(authenticated)/my-folders/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(authenticated)/my-folders/"!</div>
}
