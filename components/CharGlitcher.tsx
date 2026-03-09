import { useEffect, useState } from "react";
import styles from "./Glitcher.module.css";

type Slice = {
    start: number;
    end: number;
    move: number;
    duration: number;
    layerClass: string;
    key: string;
};

export default function GlitchChar({ char }: { char: string }) {

    const layers = [
        { slices: 8, className: styles.frontLayer, speed: 1.2 },
        { slices: 12, className: styles.midLayer, speed: 2.0 },
        { slices: 20, className: styles.backLayer, speed: 3.2 }
    ];

    const generateSlices = (): Slice[] => {

        const newSlices: Slice[] = [];

        layers.forEach((layer, layerIndex) => {

            const sliceHeight = 100 / layer.slices;

            for (let i = 0; i < layer.slices; i++) {


                //makes streaks appear less often
                if (Math.random() > 0.15) continue;

                const start = i * sliceHeight;
                const end = start + sliceHeight;

                const move = (Math.random() - 0.5) * 18;
                const duration = layer.speed * 2 + Math.random();

                newSlices.push({
                    start,
                    end,
                    move,
                    duration,
                    layerClass: layer.className,
                    key: `${layerIndex}-${i}-${Math.random()}`
                });

            }

        });

        return newSlices;

    };

    /* initialize once */
    const [slices, setSlices] = useState<Slice[]>(generateSlices);

    useEffect(() => {

        const interval = setInterval(() => {
            setSlices(generateSlices());
        }, 2000 + Math.random() * 2000);

        return () => clearInterval(interval);

    }, []);

    return (

        <span className={styles.charWrapper}>

      {slices.map(slice => (

          <span
              key={slice.key}
              className={`${styles.slice} ${slice.layerClass}`}
              style={{
                  clipPath: `inset(${slice.start}% 0 ${100 - slice.end}% 0)`,
                  transform: `translateX(${slice.move}px)`,
                  animationDuration: `${slice.duration}s`
              }}
          >
          {char}
        </span>

      ))}

            <span className={styles.clean}>
        {char}
      </span>

    </span>

    );

}

//Pre organic version
/*
type Slice = {
    start: number;
    end: number;
    move: number;
    duration: number;
    layerClass: string;
    key: string;
};

export default function GlitchChar({ char }: { char: string }) {

    const [slices, setSlices] = useState<Slice[]>([]);

    const layers = [
        { slices: 8, className: styles.frontLayer, speed: 1.2 },
        { slices: 18, className: styles.midLayer, speed: 2.0 },
        { slices: 32, className: styles.backLayer, speed: 3.2 }
    ];

    const generateSlices = () => {

        const newSlices: Slice[] = [];

        layers.forEach((layer, layerIndex) => {

            const sliceHeight = 100 / layer.slices;

            for (let i = 0; i < layer.slices; i++) {

                /!* make streaks often NOT appear *!/
                if (Math.random() > 0.2) continue;

                const start = i * sliceHeight;
                const end = start + sliceHeight;

                const move = (Math.random() - 0.5) * 18;

                const duration = layer.speed + Math.random();

                newSlices.push({
                    start,
                    end,
                    move,
                    duration,
                    layerClass: layer.className,
                    key: `${layerIndex}-${i}-${Math.random()}`
                });

            }

        });

        setSlices(newSlices);

    };

    useEffect(() => {

        generateSlices();

        const interval = setInterval(() => {
            generateSlices();
        }, 1800 + Math.random() * 2000); // random burst timing

        return () => clearInterval(interval);

    }, []);

    return (

        <span className={styles.charWrapper}>

      {slices.map(slice => (

          <span
              key={slice.key}
              className={`${styles.slice} ${slice.layerClass}`}
              style={{
                  clipPath: `inset(${slice.start}% 0 ${100 - slice.end}% 0)`,
                  transform: `translateX(${slice.move}px)`,
                  animationDuration: `${slice.duration}s`
              }}
          >
          {char}
        </span>

      ))}

            <span className={styles.clean}>
        {char}
      </span>

    </span>

    );

}*/
