import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import Infobox from './infoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyPrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';

function App() {
	const [ countries, setCountries ] = useState([]);
	const [ country, setCountry ] = useState('worldwide');
	const [ countryInfo, setCountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);
	const [ mapCenter, setMapCenter ] = useState({ lat: 34.80746, lng: -40.4796 });
	const [ mapZoom, setMapZoom ] = useState(3);
	const [ mapCountries, setMapCountries ] = useState([]);
	const [ casesType, setCasesType ] = useState('cases');
	// STATE = How to write a variable in REACT <<<<<<<<<<<<

	// USEEFFECT = Runs a piece of code
	// based on a given condition

	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json()).then((data) => {
			setCountryInfo(data);
		});
	}, []);

	useEffect(() => {
		// The code inside here will run once
		// when the component loads and not again
		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countries = data.map((country) => ({
					name  : country.country,
					value : country.countryInfo.iso2
				}));

				const sortedData = sortData(data);
				setTableData(sortedData);
				setMapCountries(data);
				setCountries(countries);
			});
		};

		getCountriesData();
	}, []); //but when variable Countries changes, this code will run as well.

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);

		let url;

		if (countryCode === 'worldwide') {
			url = 'https://disease.sh/v3/covid-19/all';
		} else {
			url = `https://disease.sh/v3/covid-19/countries/${countryCode}`;
		}

		await fetch(url)
			.then((response) => {
				// console.log( response.json());
				return response.json();
			})
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);

				const latitude = (data?.countryInfo?.lat) ? data.countryInfo.lat : 34.80746;
				const longitude = (data?.countryInfo?.long)  ? data.countryInfo.long : -40.4796;
				setMapCenter([latitude, longitude]);
				
				const zoom = (data?.countryInfo?.lat) ? 3 : 2;
				setMapZoom(zoom);
			});

		console.log(countryInfo);
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select variant="outlined" onChange={onCountryChange} value={country}>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => <MenuItem value={country.value}>{country.name}</MenuItem>)}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<Infobox
						isRed
						active={casesType === 'cases'}
						onClick={(e) => setCasesType('cases')}
						title="Coronavirus Cases"
						cases={prettyPrintStat(countryInfo.todayCases)}
						total={prettyPrintStat(countryInfo.cases)}
					/>
					<Infobox
						active={casesType === 'recovered'}
						onClick={(e) => setCasesType('recovered')}
						title="Recovered"
						cases={prettyPrintStat(countryInfo.todayRecovered)}
						total={prettyPrintStat(countryInfo.recovered)}
					/>
					<Infobox
						isRed
						active={casesType === 'deaths'}
						onClick={(e) => setCasesType('deaths')}
						title="Deaths"
						cases={prettyPrintStat(countryInfo.deaths)}
						total={prettyPrintStat(countryInfo.deaths)}
					/>
				</div>

				{/* Header */}
				{/* Title + Select input dropdown field */}

				<Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
				{/* Map */}
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<h3 className="app__graphTitle">Worldwide new {casesType}</h3>
					<LineGraph className="app__graph" casesType={casesType} />
					{/* Graph */}
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
