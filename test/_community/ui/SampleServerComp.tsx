import type { CustomComponent, PayloadServerReactComponent } from 'payload'

type ServerComp = PayloadServerReactComponent<CustomComponent<{ myProp: string }>>

export const SampleServerComp: ServerComp = ({
  i18n, // Notice that this is still typed
  myProp,
  payload, // And this too
}) => {
  console.log(i18n, payload, myProp) // undefined, undefined, string on server
  return (
    <p>
      Said was here but, unfortunately, <b>without i18n</b> :big_sad:
    </p>
  )
}
