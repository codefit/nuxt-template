export function useReveal() {
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const nodes = document.querySelectorAll('.reveal:not(.is-visible)')
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer?.unobserve(entry.target)
          }
        }
      },
      { threshold: 0.18 },
    )

    nodes.forEach((node) => observer?.observe(node))
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
  })
}
