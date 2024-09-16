"use client"
import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BottleFlip = () => {
  // Get the scroll position
  const { scrollYProgress } = useScroll();
  const fontStyles: React.CSSProperties = {
    fontFamily: "'Lobster', cursive",
    fontSize: "48px", // Ensure units are specified like "px"
    textAlign: "center", // Use one of the allowed values like 'center'
    color: "white",
    marginTop: "50px", // Make sure margins use "px" or other CSS units
  };

  // Map the scroll position to rotation for each cylinder
  const rotateRed = useTransform(scrollYProgress, [0, 0.05], [0, 180]);
  const rotateYellow = useTransform(scrollYProgress, [0, 0.05], [0, -180]);

  const redToPink = useTransform(
    scrollYProgress,
    [0.3, 0.5],
    ["#ff0000", "#ffc0cb"]
  );

  // Opacity for the final image after the red line transitions
  const finalImageOpacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const finalImageOpacity2 = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);
  const finalImageOpacity3 = useTransform(scrollYProgress, [0.6, .8], [0, 1]);
  const line1Opacity = useTransform(scrollYProgress, [0.8, .85], [0, 1]);
  const line2Opacity = useTransform(scrollYProgress, [0.85, .9], [0, 1]);
  const line3Opacity = useTransform(scrollYProgress, [0.9, .96], [0, 1]);
  const line4Opacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);
  const line5Opacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);
  // Map the scroll position to control the line heights, extending to the Batman and Robin logo
  const redLineHeight = useTransform(
    scrollYProgress,
    [0.05, 0.3],
    ["0%", "100vh"]
  );
  const yellowLineHeight = useTransform(
    scrollYProgress,
    [0.05, 0.3],
    ["0%", "100vh"]
  );
  const redLineHeight2 = useTransform(
    scrollYProgress,
    [0.3, 0.7],
    ["0%", "130vh"]
  );
  const redLineHeight3 = useTransform(
    scrollYProgress,
    [0.6, 0.8],
    ["0%", "120vh"]
  );
  const redLineHeight4 = useTransform(
    scrollYProgress,
    [0.7, 1],
    ["0%", "120vh"]
  );


  // Fade in Batman and Robin logo at a certain scroll point
  const logoOpacity = useTransform(scrollYProgress, [0.3, 0.35], [0, 1]);

  // Styles for the cylinders
  const redCylinderStyle = {
    width: "100px",
    height: "300px",
    backgroundColor: "red", // Red cylinder
    borderRadius: "50px",
    margin: "0 20px",
  };

  const yellowCylinderStyle = {
    width: "100px",
    height: "300px",
    backgroundColor: "yellow", // Yellow cylinder
    borderRadius: "50px",
    margin: "0 20px",
  };

  const bCylinderStyle = {
    width: "100px",
    height: "100px",
    borderRadius: "50px",
    margin: "0 20px",
  };

  // Styles for the lines
  const lineStyle = {
    width: "10px",
    borderRadius: "5px",
    marginTop: "20px",
  };

  return (
    <>
      <div>
        <div style={{ height: "10vh" }} />
        <h1 style={fontStyles}>The ketchup to my mustard</h1>;
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "100px",
          }}
        >
          {/* Red Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...redCylinderStyle, rotate: rotateRed }} />
            {/* Red Line below Red Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "red",
                height: redLineHeight, // Animate the height based on scroll
              }}
            />
          </div>

          {/* Yellow Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div
              style={{ ...yellowCylinderStyle, rotate: rotateYellow }}
            />
            {/* Yellow Line below Yellow Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "yellow",
                height: yellowLineHeight, // Animate the height based on scroll
              }}
            />
          </div>
        </div>
        {/* Batman and Robin logo appears as you scroll */}
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            opacity: logoOpacity, // Fade in the logo as you scroll
          }}
        >
          {/* Replace with actual Batman and Robin logo */}
          <h3 style={fontStyles}>my hero and my sidekick</h3>
          <img src="/batman.png" alt="Batman and Robin" />
        </motion.div>
      </div>
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Red Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateRed }} />
            {/* Red Line below Red Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: redToPink, // Transition from red to pink
                height: redLineHeight2, // Animate the height based on scroll
              }}
            />
          </div>

          {/* Yellow Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateYellow }} />
            {/* Yellow Line below Yellow Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "yellow",
                height: redLineHeight2, // Animate the height based on scroll
              }}
            />
          </div>
        </div>

        {/* Another image appears after the red line turns pink */}
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",

            opacity: finalImageOpacity, // Fade in the final image as you scroll
          }}
        >
          {/* Replace with your final image */}
          <h3 style={fontStyles}>my best friend</h3>
          <img src="/sponge.png" alt="Final Image" />
        </motion.div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Red Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateRed }} />
            {/* Red Line below Red Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "red", // Transition from red to pink
                height: redLineHeight3, // Animate the height based on scroll
              }}
            />
          </div>

          {/* Yellow Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateYellow }} />
            {/* Yellow Line below Yellow Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "yellow",
                height: redLineHeight3, // Animate the height based on scroll
              }}
            />
          </div>
        </div>
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            opacity: finalImageOpacity2, // Fade in the final image as you scroll
          }}
        >
          {/* Replace with your final image */}
          <h3 style={fontStyles}>my beauty</h3>
          <img src="/beauty.png" alt="Final Image" />
        </motion.div>

<div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Red Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateRed }} />
            {/* Red Line below Red Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "red", // Transition from red to pink
                height: redLineHeight4, // Animate the height based on scroll
              }}
            />
          </div>

          {/* Yellow Cylinder */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <motion.div style={{ ...bCylinderStyle, rotate: rotateYellow }} />
            {/* Yellow Line below Yellow Cylinder */}
            <motion.div
              style={{
                ...lineStyle,
                backgroundColor: "yellow",
                height: redLineHeight4, // Animate the height based on scroll
              }}
            />
          </div>
        </div>
        <motion.div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            opacity: finalImageOpacity3, // Fade in the final image as you scroll
          }}
        >
          {/* Replace with your final image */}
          <h3 style={fontStyles}>Im so glad i found you</h3>
          <img src="/nemo.png" alt="Final Image" />
        </motion.div>
        <div style={{ height: "10vh" }} />
        {/* Continue scrolling for more content */}
        <div style={{ height: "200vh" }}>
      {/* Line 1 */}
      <motion.h3 style={{ ...fontStyles, opacity: line1Opacity }}>
        Great things come in pairs
      </motion.h3>

      {/* Line 2 */}
      <motion.h3 style={{ ...fontStyles, opacity: line2Opacity }}>
        I love you!
      </motion.h3>

      {/* Line 3 */}
      <motion.h3 style={{ ...fontStyles, opacity: line3Opacity }}>
        I am so grateful to have spent a pair of years with you
      </motion.h3>

      {/* Line 4 */}
      <motion.h3 style={{ ...fontStyles, opacity: line4Opacity }}>
        Forever and always, we make the best pair
      </motion.h3>

      {/* Line 5 */}
      <motion.h3 style={{ ...fontStyles, opacity: line5Opacity }}>
        Love, Eli
      </motion.h3>
    </div>
      </div>
    </>
  );
};

export default BottleFlip;
