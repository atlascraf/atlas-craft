export default function Logo() {
  const base = import.meta.env.BASE_URL
  return (
    <img
      className="brand-logo"
      src={`${base}brand/atlas-craft-icon.jpg`}
      alt="Atlas Craft"
      width={40}
      height={40}
    />
  )
}
