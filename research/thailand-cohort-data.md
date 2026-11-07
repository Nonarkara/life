# Thailand cohort data

Source: World Bank API (THA) plus Wikipedia Religion_in_Thailand and Demographics_of_Thailand. Full data with URLs: thailand-cohort-data.json.

| Year | Pop (M) | Births/yr (derived) | LE | IMR | U5MR | TFR | Urban % | GDPpc | Agri % |
|---|---|---|---|---|---|---|---|---|---|
| 1960 | 26.9 | 1176107 | 50.61 | 113.3 | 147.5 | 6.33 | 11.83 | 592.47 | None |
| 1970 | 36.0 | 1320605 | 56.47 | 78.7 | 99.8 | 5.45 | 13.29 | 969.51 | None |
| 1981 | 46.6 | 1189082 | 62.86 | 47.5 | 58 | 3.13 | 17.28 | 1538.43 | None |
| 1990 | 54.7 | 1073966 | 68.92 | 30.9 | 36.9 | 2.06 | 18.81 | 2631.52 | None |
| 2000 | 63.0 | 947007 | 71.2 | 18.3 | 21.7 | 1.73 | 31.46 | 3514.72 | 44.42 |
| 2010 | 68.6 | 823639 | 75.01 | 11.9 | 14.1 | 1.56 | 44.0 | 5059.36 | 38.24 |
| 2020 | 71.6 | 629729 | 77.33 | 8.7 | 10.1 | 1.26 | 57.24 | 6032.42 | 31.39 |
| 2023 | 71.7 | 590828 | 76.41 | 7.9 | 9.2 | 1.21 | 60.93 | 6423.99 | 30.22 |

GDPpc = constant US$ (World Bank). Agri % is null where the ILO series does not exist (starts 1991).

Shocks, GDP per capita growth %: 1997 -4.04, 1998 -8.83, 2008 0.95, 2009 -1.42.

Other: Muslims 4.29% (2015), 24.33% of the south; Buddhist 94% (2018) or 90% (2023); Christian about 4% (2023); household size 5.7 (1970) and 3.2 (2010).

## Missing
- Population, births, life expectancy, fertility, IMR before 1960: null. World Bank series start 1960; UN WPP not fetched. Cohorts 1940/1949/1950 therefore have no sourced value.
- 2026 cohort: no 2026 data exist in World Bank series (latest 2024/2025); use 2024 values labelled as such or fetch UN WPP projections.
- Regional population shares (Bangkok/central, north, Isan, south): null. Wikipedia extract stripped tables and no NSO table was opened.
- Religion by era: only 2015/2018/2023 snapshots; Christian and other shares are survey-based. Per-province Muslim shares (Pattani/Yala/Narathiwat) not retrieved; page only names provinces.
- Schooling: only gross enrolment (can exceed 100, not attainment). Primary 1981, secondary gaps (2000 missing in WB series). No attainment or lower/upper secondary split.
- Workforce by sector: World Bank (ILO modelled) begins 1991; nothing for 1940-1990.
- Causes of death by era (infectious to NCD, road traffic): null. WHO/GBD not opened in this pass.
- Household size: only 1970 and 2010 from Wikipedia citing census; 1980-2000 null.
- 1997 crisis: World Bank per-capita growth for 1997/1998 included where present; GDP level series is constant-2015 USD (check World Bank metadata).
- Regional TFR table on Wikipedia (DHS) was not parseable from the text extract.

## Weakest source
Wikipedia religion and household figures (secondary, mixed census and survey years). World Bank employment shares are ILO modelled estimates.
