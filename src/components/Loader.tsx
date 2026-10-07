import './Loader.css'

interface Props {
  hidden: boolean
}

export default function Loader({ hidden }: Props) {
  return (
    <div className={`loader${hidden ? ' loader-hidden' : ''}`} aria-hidden={hidden}>
      <span className="loader-text">LOADING</span>
    </div>
  )
}
