const animationTimeline = () => {
  const textBoxChars = document.getElementsByClassName("hbd-chatbox")[0];
  const hbd = document.getElementsByClassName("wish-hbd")[0];

  textBoxChars.innerHTML = `<span>${textBoxChars.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  hbd.innerHTML = `<span>${hbd.innerHTML
    .split("")
    .join("</span><span>")}</span>`;

  // smoother text animation
  const ideaTextTrans = {
    opacity: 0,
    y: -25,
    rotationX: 8,
    skewX: "12deg",
  };

  const ideaTextTransLeave = {
    opacity: 0,
    y: 25,
    rotationY: 5,
    skewX: "-12deg",
  };

  const tl = new TimelineMax();

  tl.to(".container", 0.1, { visibility: "visible" })

    // INTRO
    .from(".one", 1.2, { opacity: 0, y: 20 })
    .from(".two", 1.0, { opacity: 0, y: 20 }, "+=0.5")

    .to(".one", 1.0, { opacity: 0, y: 20 }, "+=3")
    .to(".two", 1.0, { opacity: 0, y: 20 }, "-=0.5")

    // MESSAGE 1
    .from(".three", 1.5, { opacity: 0, y: 20 })
    .to(".three", 1.2, { opacity: 0, y: 20 }, "+=3")

    // CHAT BOX (IMPORTANT PART - SLOW)
    .from(".four", 1.2, { scale: 0.3, opacity: 0 })
    .from(".fake-btn", 0.6, { scale: 0.2, opacity: 0 })

    .staggerTo(".hbd-chatbox span", 0.6, {
      visibility: "visible",
    }, 0.04)

    .to(".fake-btn", 0.3, {
      backgroundColor: "rgb(127, 206, 248)",
    })

    .to(".four", 1.0, {
      scale: 0.2,
      opacity: 0,
      y: -120,
    }, "+=1.2")

    // IDEAS (LONG TEXTS = SLOWER)
    .from(".idea-1", 1.4, ideaTextTrans)
    .to(".idea-1", 1.2, ideaTextTransLeave, "+=2.5")

    .from(".idea-2", 1.6, ideaTextTrans)
    .to(".idea-2", 1.4, ideaTextTransLeave, "+=2.8")

    .from(".idea-3", 1.5, ideaTextTrans)
    .to(".idea-3 strong", 0.8, {
      scale: 1.3,
      x: 10,
      backgroundColor: "rgb(21, 161, 237)",
      color: "#fff",
    })
    .to(".idea-3", 1.4, ideaTextTransLeave, "+=2.8")

    .from(".idea-4", 1.6, ideaTextTrans)
    .to(".idea-4", 1.4, ideaTextTransLeave, "+=3")

    .from(".idea-5", 1.6, {
      rotationX: 12,
      rotationZ: -8,
      skewY: "-5deg",
      y: 60,
      opacity: 0,
    }, "+=0.8")

    .to(".idea-5 span", 0.9, {
      rotation: 90,
      x: 10,
    }, "+=0.6")

    .to(".idea-5", 1.5, {
      scale: 0.2,
      opacity: 0,
    }, "+=2.5")

    // FINAL WORD
    .staggerFrom(".idea-6 span", 1.0, {
      scale: 3,
      opacity: 0,
      rotation: 20,
      ease: Expo.easeOut,
    }, 0.25)

    .staggerTo(".idea-6 span", 1.0, {
      scale: 3,
      opacity: 0,
      rotation: -20,
      ease: Expo.easeOut,
    }, 0.25, "+=1.5")

    // BALLOONS (slow cinematic)
    .staggerFromTo(".baloons img", 3.5, {
      opacity: 0.8,
      y: 1200,
    }, {
      opacity: 1,
      y: -1000,
    }, 0.25)

    .from(".girl-dp", 1.0, {
      scale: 3,
      opacity: 0,
      x: 20,
      y: -20,
      rotationZ: -30,
    }, "-=2")

    // FINAL MESSAGE
    .staggerFrom(".wish-hbd span", 1.0, {
      opacity: 0,
      y: -50,
      rotation: 120,
      skewX: "25deg",
      ease: Elastic.easeOut.config(1, 0.5),
    }, 0.1)

    .staggerFromTo(".wish-hbd span", 1.0, {
      scale: 1.4,
      rotationY: 150,
    }, {
      scale: 1,
      rotationY: 0,
      color: "#ff69b4",
      ease: Expo.easeOut,
    }, 0.1, "party")

    .from(".wish h5", 1.2, {
      opacity: 0,
      y: 15,
      skewX: "-10deg",
    }, "party")

    // END SCENE (slow emotional fade)
    .staggerFrom(".nine p", 1.8, ideaTextTrans, 1.5)

    .to(".last-smile", 0.6, {
      rotation: 90,
    }, "+=1.5")

    // PROPOSAL (FINAL MOMENT - IMPORTANT)
    .to("#proposalSection", 3.5, {
      opacity: 1,
      y: 0,
      ease: Power2.easeOut
    }, "+=2");

  // REPLAY
  document.getElementById("replay").addEventListener("click", () => {
    tl.restart();
  });
};
