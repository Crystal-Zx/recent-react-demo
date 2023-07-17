import createPuzzle from "create-puzzle"
// import VerifyBgUrl from "../../assets/images/verify_bg.jpeg"
// import VerifySliderUrl from "../../assets/images/verify_slider.jpeg"
import VerifyImg from "../../assets/images/verify.png"

import SliderCaptcha from "rc-slider-captcha"
import { useRef } from "react"
import { random } from "lodash"

export default function VerifySlider() {
  const offsetXRef = useRef(0) // x 轴偏移值

  return (
    <>
      <img src={VerifyImg} />
      <SliderCaptcha
        request={() =>
          createPuzzle(VerifyImg, {
            x: random(80, 300, false),
          }).then(res => {
            offsetXRef.current = res.x
            console.log(res)
            return {
              bgUrl: res.bgUrl,
              puzzleUrl: res.puzzleUrl,
            }
          })
        }
        onVerify={async data => {
          console.log(data)
          if (
            data.x >= offsetXRef.current - 5 &&
            data.x < offsetXRef.current + 5
          ) {
            return Promise.resolve()
          }
          return Promise.reject()
        }}
        bgSize={{
          width: 320,
          height: 180,
        }}
        loadingDelay={300}
        // mode="float"
      />
    </>
  )
}
