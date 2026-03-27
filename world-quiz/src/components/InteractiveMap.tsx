import '../App.css';
import countriesGeoJson from '@countries-geo';
import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import 'ol/ol.css';
import { Map, View, MapBrowserEvent } from 'ol';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Style, Text } from 'ol/style';
import {
  defaultFill,
  hoverFill,
  correctFill,
  wrongFill,
  defaultStroke,
  defaultTextFill,
} from '@/utils/mapStyles';
import { fromLonLat } from 'ol/proj';
import { Zoom } from 'ol/control';
import { getCenter } from 'ol/extent';

import glStyle from '../data/map-styles.json';
import { apply } from 'ol-mapbox-style';
import { Link } from 'react-router-dom';

import { createPortal } from 'react-dom';
import CountryGuessSnackbar from './snackbars/CountryGuessSnackbar.tsx';
import CorrectAlert from './snackbars/CorrectAlert.tsx';
import WrongAlert from './snackbars/WrongAlert.tsx';
import QuizMenu from '@components/QuizMenu';
import QuizSettingsModal from '@components/QuizSettingsModal';
import QuizResultsModal from '@components/QuizResultsModal';
import { saveQuizResults } from '@/api/quiz';
import { ExtendedFeature } from '@/types/ol-feature';

export type { ExtendedFeature } from '@/types/ol-feature';

const pickQuizCountries = (
  allFeatures: ExtendedFeature[],
  count: number,
): { name: string; code: string }[] => {
  const pool = allFeatures.filter((f) => f.get('adm0_a3') && f.get('name_ru'));
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map((f) => ({
    name: String(f.get('name_ru')),
    code: String(f.get('adm0_a3')),
  }));
};

function InteractiveMap({ isExplore }: { isExplore?: boolean }) {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [features, setFeatures] = useState<ExtendedFeature[]>([]);
  const [quizCountries, setQuizCountries] = useState<
    { name: string; code: string }[]
  >([]);
  const [quizCountry, setQuizCountry] = useState<ExtendedFeature | null>(null);

  const [showQuizMenu, setShowQuizMenu] = useState(true);
  const [quizSettingModalOpen, setQuizSettingModalOpen] = useState(!isExplore);
  const [countryGuessSnackbarOpen, setCountryGuessSnackbarOpen] =
    useState(false);
  const [countryGuessSnackbarMessage, setCountryGuessSnackbarMessage] =
    useState('');

  const [correctAlertOpen, setCorrectAlertOpen] = useState(false);
  const [wrongAlertOpen, setWrongAlertOpen] = useState(false);
  const [quizResultsModalOpen, setQuizResultsModalOpen] = useState(false);

  const [countriesCount, setCountriesCount] = useState(5);
  const [countriesLeft, setCountriesLeft] = useState(countriesCount);
  const [correctGuesses, setCorrectGuesses] = useState<number[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState<number[]>([]);

  const progress = useMemo(() => {
    return Math.round((correctGuesses.length / countriesCount) * 100);
  }, [correctGuesses, countriesCount]);

  useEffect(() => {
    const initialMap = new Map({
      target: mapContainer.current || undefined, // Ваш контейнер
      view: new View({
        center: fromLonLat([0, 0]),
        zoom: 2,
      }),
    });
    const initMap = () => {
      try {
        const defaultControls = initialMap.getControls();

        defaultControls.forEach((control) => {
          if (control instanceof Zoom) {
            initialMap.removeControl(control);
          }
        });

        void apply(initialMap, glStyle);

        const vectorSource = new VectorSource();

        const features = new GeoJSON().readFeatures(countriesGeoJson, {
          featureProjection: 'EPSG:3857',
          dataProjection: 'EPSG:4326',
        });

        vectorSource.addFeatures(features);

        vectorSource.getFeatures().forEach((feature: ExtendedFeature) => {
          if (isExplore) {
            const nameRu = feature.get('name_ru');
            const text = new Text({
              text: nameRu,
              textAlign: 'center',
              offsetY: 0, // Offset from the center vertically
              fill: defaultTextFill,
              font: '10px Oswald',
              // overflow: true,
            });
            feature.setStyle(
              new Style({
                text: text,
                stroke: defaultStroke,
                fill: defaultFill,
              }),
            );
          } else {
            feature.setStyle(
              new Style({
                stroke: defaultStroke,
                fill: defaultFill,
              }),
            );
          }
        });

        const featuresNew: ExtendedFeature[] = vectorSource.getFeatures();
        featuresNew
          .sort((a, b) => {
            const nameA = a.get('name');
            const nameB = b.get('name');
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          })
          .forEach((feature, index) => {
            feature.set('country_index', index);
          });
        setFeatures(featuresNew);

        const vectorLayer = new VectorLayer({
          source: vectorSource,
        });

        initialMap.on('pointermove', function (evt) {
          const feature: ExtendedFeature = initialMap.forEachFeatureAtPixel(
            evt.pixel,
            function (feature) {
              return feature;
            },
          ) as ExtendedFeature;

          // TODO Optimize
          featuresNew.forEach(function (featureEl: ExtendedFeature) {
            if (!featureEl.get('used')) {
              const existingStyle = featureEl.getStyle();
              if (existingStyle instanceof Style) {
                existingStyle.setFill(defaultFill);
              }
              featureEl.setStyle(existingStyle);
              document.body.style.cursor = 'default';
            }
          });

          if (feature && feature.get('adm0_a3') && !feature.get('used')) {
            const existingStyle = feature.getStyle();
            if (existingStyle instanceof Style) {
              existingStyle.setFill(hoverFill);
            }
            feature.setStyle(existingStyle);
            document.body.style.cursor = 'pointer';
          }
        });

        initialMap.addLayer(vectorLayer);
        setMap(initialMap);
      } catch (e) {
        console.log('e', e);
      }
    };

    initMap();

    return () => initialMap.setTarget(undefined);
  }, [isExplore]);

  const redrawFeatures = useCallback(
    (drawText = true) => {
      features.forEach((feature: ExtendedFeature) => {
        const nameRu = feature.get('name_ru');
        const existingStyle = feature.getStyle();
        if (!drawText) {
          if (existingStyle instanceof Style) {
            const emptyText = new Text({ text: '' });
            existingStyle.setText(emptyText);
          }
          feature.setStyle(existingStyle);
          return;
        }
        const text = new Text({
          text: nameRu,
          textAlign: 'center',
          offsetY: 0,
          fill: defaultTextFill,
          font: '10px Oswald',
        });
        if (existingStyle instanceof Style) {
          existingStyle.setText(text);
        }
        feature.setStyle(existingStyle);
      });
    },
    [features],
  );

  const askRandomCountry = useCallback(() => {
    let currentQuizCountries = quizCountries;

    // если список стран пуст — запрашиваем новые
    if (currentQuizCountries.length === 0) {
      const countries = pickQuizCountries(features, countriesCount);
      setQuizCountries(countries);
      currentQuizCountries = countries;
    }

    if (currentQuizCountries.length === 0) return;

    const [nextCountry, ...rest] = currentQuizCountries;

    const featureToGuess = features.find(
      (f: ExtendedFeature) => f.get('adm0_a3') === nextCountry.code,
    );

    if (!featureToGuess) return;

    setQuizCountry(featureToGuess);
    setQuizCountries(rest);
    setCountryGuessSnackbarMessage(nextCountry.name);
    setCountryGuessSnackbarOpen(true);
  }, [quizCountries, countriesCount, features]);

  const restartQuiz = useCallback(() => {
    setQuizCountry(null);
    setCountriesLeft(countriesCount);
    setCorrectGuesses([]);
    setWrongGuesses([]);
    features.forEach((feature: ExtendedFeature) => feature.set('used', false));
    setShowQuizMenu(true);
    askRandomCountry();
  }, [askRandomCountry, countriesCount, features]);

  useEffect(() => {
    const handleMapClick = (event: MapBrowserEvent<MouseEvent>) => {
      if (countriesLeft < 1) {
        return;
      }
      // @ts-ignore
      map?.forEachFeatureAtPixel(event.pixel, (feature: ExtendedFeature) => {
        if (
          !feature ||
          !feature.get('adm0_a3') ||
          feature.get('used') ||
          !quizCountry
        ) {
          return;
        }
        setCountriesLeft(countriesLeft - 1);
        const existingStyle = quizCountry.getStyle();
        quizCountry.set('used', true);
        if (feature === quizCountry) {
          quizCountry.set('guessed', true);
          if (existingStyle instanceof Style) {
            existingStyle.setFill(correctFill);
          }
          setCorrectGuesses([
            ...correctGuesses,
            quizCountry.get('country_index'),
          ]);
          setCorrectAlertOpen(true);
        } else {
          document.body.style.cursor = 'default';
          quizCountry.set('guessed', false);
          if (existingStyle instanceof Style) {
            existingStyle.setFill(wrongFill);
          }
          setWrongGuesses([...wrongGuesses, quizCountry.get('country_index')]);
          setWrongAlertOpen(true);
        }
        quizCountry.setStyle(existingStyle);

        // @ts-ignore
        const coords = quizCountry.getGeometry().getExtent();
        const center = getCenter(coords);

        map?.getView().animate({
          center: center,
          duration: 1000,
        });
        if (countriesLeft === 1) {
          setCountryGuessSnackbarOpen(false);
          setShowQuizMenu(false);
          void saveQuizResults(features, countriesCount);
          setTimeout(() => {
            setQuizResultsModalOpen(true);
          }, 1500);
        } else {
          void askRandomCountry();
        }
      });
    };

    if (map && !isExplore) {
      map.on('click', handleMapClick);
      return () => map.un('click', handleMapClick);
    }
  }, [
    askRandomCountry,
    correctGuesses,
    countriesCount,
    countriesLeft,
    features,
    isExplore,
    map,
    quizCountry,
    wrongGuesses,
  ]);

  return (
    <div className='relative'>
      {createPortal(
        <Link to='/' className='absolute left-4 top-4 z-[9999]'>
          <ArrowBackIcon className='z-10 rounded-full bg-black p-3 !text-5xl text-white' />
        </Link>,
        document.body,
      )}
      <QuizSettingsModal
        handleClick={() => {
          askRandomCountry();
        }}
        isExplore={isExplore}
        countriesCount={countriesCount}
        setCountriesCount={setCountriesCount}
        setCountriesLeft={setCountriesLeft}
        open={quizSettingModalOpen}
        setOpen={setQuizSettingModalOpen}
      />
      <CountryGuessSnackbar
        snackbarOpen={countryGuessSnackbarOpen}
        setSnackbarOpen={setCountryGuessSnackbarOpen}
        snackbarMessage={countryGuessSnackbarMessage}
      />
      <CorrectAlert open={correctAlertOpen} setOpen={setCorrectAlertOpen} />
      <WrongAlert open={wrongAlertOpen} setOpen={setWrongAlertOpen} />
      <QuizResultsModal
        open={quizResultsModalOpen}
        setOpen={setQuizResultsModalOpen}
        progress={progress}
        handleClick={restartQuiz}
        setShowQuizMenu={setShowQuizMenu}
        redrawFeatures={redrawFeatures}
      />
      {!quizSettingModalOpen && !isExplore && showQuizMenu && (
        <QuizMenu
          correctCount={correctGuesses.length}
          wrongCount={wrongGuesses.length}
          leftCount={countriesLeft}
          isWatchResultsMode={countriesLeft < 1}
          handleClick={() => {
            redrawFeatures(false);
            restartQuiz();
          }}
        />
      )}
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100vh',
        }}
      />
    </div>
  );
}

export default InteractiveMap;
