'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';

const countries = [
  { value: 'afghanistan', label: 'Afghanistan' },
  { value: 'albania', label: 'Albania' },
  { value: 'algeria', label: 'Algeria' },
  { value: 'andorra', label: 'Andorra' },
  { value: 'angola', label: 'Angola' },
  { value: 'antigua-and-barbuda', label: 'Antigua and Barbuda' },
  { value: 'argentina', label: 'Argentina' },
  { value: 'armenia', label: 'Armenia' },
  { value: 'australia', label: 'Australia' },
  { value: 'austria', label: 'Austria' },
  { value: 'azerbaijan', label: 'Azerbaijan' },
  { value: 'bahamas', label: 'Bahamas' },
  { value: 'bahrain', label: 'Bahrain' },
  { value: 'bangladesh', label: 'Bangladesh' },
  { value: 'barbados', label: 'Barbados' },
  { value: 'belarus', label: 'Belarus' },
  { value: 'belgium', label: 'Belgium' },
  { value: 'belize', label: 'Belize' },
  { value: 'benin', label: 'Benin' },
  { value: 'bhutan', label: 'Bhutan' },
  { value: 'bolivia', label: 'Bolivia' },
  { value: 'bosnia-and-herzegovina', label: 'Bosnia and Herzegovina' },
  { value: 'botswana', label: 'Botswana' },
  { value: 'brazil', label: 'Brazil' },
  { value: 'brunei', label: 'Brunei' },
  { value: 'bulgaria', label: 'Bulgaria' },
  { value: 'burkina-faso', label: 'Burkina Faso' },
  { value: 'burundi', label: 'Burundi' },
  { value: 'cabo-verde', label: 'Cabo Verde' },
  { value: 'cambodia', label: 'Cambodia' },
  { value: 'cameroon', label: 'Cameroon' },
  { value: 'canada', label: 'Canada' },
  { value: 'central-african-republic', label: 'Central African Republic' },
  { value: 'chad', label: 'Chad' },
  { value: 'chile', label: 'Chile' },
  { value: 'china', label: 'China' },
  { value: 'colombia', label: 'Colombia' },
  { value: 'comoros', label: 'Comoros' },
  { value: 'costa-rica', label: 'Costa Rica' },
  { value: 'croatia', label: 'Croatia' },
  { value: 'cuba', label: 'Cuba' },
  { value: 'cyprus', label: 'Cyprus' },
  { value: 'czech-republic', label: 'Czech Republic' },
  { value: 'democratic-republic-of-the-congo', label: 'Democratic Republic of the Congo' },
  { value: 'denmark', label: 'Denmark' },
  { value: 'djibouti', label: 'Djibouti' },
  { value: 'dominica', label: 'Dominica' },
  { value: 'dominican-republic', label: 'Dominican Republic' },
  { value: 'east-timor', label: 'East Timor' },
  { value: 'ecuador', label: 'Ecuador' },
  { value: 'egypt', label: 'Egypt' },
  { value: 'el-salvador', label: 'El Salvador' },
  { value: 'equatorial-guinea', label: 'Equatorial Guinea' },
  { value: 'eritrea', label: 'Eritrea' },
  { value: 'estonia', label: 'Estonia' },
  { value: 'eswatini', label: 'Eswatini' },
  { value: 'ethiopia', label: 'Ethiopia' },
  { value: 'fiji', label: 'Fiji' },
  { value: 'finland', label: 'Finland' },
  { value: 'france', label: 'France' },
  { value: 'gabon', label: 'Gabon' },
  { value: 'gambia', label: 'Gambia' },
  { value: 'georgia', label: 'Georgia' },
  { value: 'germany', label: 'Germany' },
  { value: 'ghana', label: 'Ghana' },
  { value: 'greece', label: 'Greece' },
  { value: 'grenada', label: 'Grenada' },
  { value: 'guatemala', label: 'Guatemala' },
  { value: 'guinea', label: 'Guinea' },
  { value: 'guinea-bissau', label: 'Guinea-Bissau' },
  { value: 'guyana', label: 'Guyana' },
  { value: 'haiti', label: 'Haiti' },
  { value: 'honduras', label: 'Honduras' },
  { value: 'hungary', label: 'Hungary' },
  { value: 'iceland', label: 'Iceland' },
  { value: 'india', label: 'India' },
  { value: 'indonesia', label: 'Indonesia' },
  { value: 'iran', label: 'Iran' },
  { value: 'iraq', label: 'Iraq' },
  { value: 'ireland', label: 'Ireland' },
  { value: 'israel', label: 'Israel' },
  { value: 'italy', label: 'Italy' },
  { value: 'ivory-coast', label: 'Ivory Coast' },
  { value: 'jamaica', label: 'Jamaica' },
  { value: 'japan', label: 'Japan' },
  { value: 'jordan', label: 'Jordan' },
  { value: 'kazakhstan', label: 'Kazakhstan' },
  { value: 'kenya', label: 'Kenya' },
  { value: 'kiribati', label: 'Kiribati' },
  { value: 'kosovo', label: 'Kosovo' },
  { value: 'kuwait', label: 'Kuwait' },
  { value: 'kyrgyzstan', label: 'Kyrgyzstan' },
  { value: 'laos', label: 'Laos' },
  { value: 'latvia', label: 'Latvia' },
  { value: 'lebanon', label: 'Lebanon' },
  { value: 'lesotho', label: 'Lesotho' },
  { value: 'liberia', label: 'Liberia' },
  { value: 'libya', label: 'Libya' },
  { value: 'liechtenstein', label: 'Liechtenstein' },
  { value: 'lithuania', label: 'Lithuania' },
  { value: 'luxembourg', label: 'Luxembourg' },
  { value: 'madagascar', label: 'Madagascar' },
  { value: 'malawi', label: 'Malawi' },
  { value: 'malaysia', label: 'Malaysia' },
  { value: 'maldives', label: 'Maldives' },
  { value: 'mali', label: 'Mali' },
  { value: 'malta', label: 'Malta' },
  { value: 'marshall-islands', label: 'Marshall Islands' },
  { value: 'mauritania', label: 'Mauritania' },
  { value: 'mauritius', label: 'Mauritius' },
  { value: 'mexico', label: 'Mexico' },
  { value: 'micronesia', label: 'Micronesia' },
  { value: 'moldova', label: 'Moldova' },
  { value: 'monaco', label: 'Monaco' },
  { value: 'mongolia', label: 'Mongolia' },
  { value: 'montenegro', label: 'Montenegro' },
  { value: 'morocco', label: 'Morocco' },
  { value: 'mozambique', label: 'Mozambique' },
  { value: 'myanmar', label: 'Myanmar' },
  { value: 'namibia', label: 'Namibia' },
  { value: 'nauru', label: 'Nauru' },
  { value: 'nepal', label: 'Nepal' },
  { value: 'netherlands', label: 'Netherlands' },
  { value: 'new-zealand', label: 'New Zealand' },
  { value: 'nicaragua', label: 'Nicaragua' },
  { value: 'niger', label: 'Niger' },
  { value: 'nigeria', label: 'Nigeria' },
  { value: 'north-korea', label: 'North Korea' },
  { value: 'north-macedonia', label: 'North Macedonia' },
  { value: 'norway', label: 'Norway' },
  { value: 'oman', label: 'Oman' },
  { value: 'pakistan', label: 'Pakistan' },
  { value: 'palau', label: 'Palau' },
  { value: 'panama', label: 'Panama' },
  { value: 'papua-new-guinea', label: 'Papua New Guinea' },
  { value: 'paraguay', label: 'Paraguay' },
  { value: 'peru', label: 'Peru' },
  { value: 'philippines', label: 'Philippines' },
  { value: 'poland', label: 'Poland' },
  { value: 'portugal', label: 'Portugal' },
  { value: 'qatar', label: 'Qatar' },
  { value: 'republic-of-the-congo', label: 'Republic of the Congo' },
  { value: 'romania', label: 'Romania' },
  { value: 'russia', label: 'Russia' },
  { value: 'rwanda', label: 'Rwanda' },
  { value: 'saint-kitts-and-nevis', label: 'Saint Kitts and Nevis' },
  { value: 'saint-lucia', label: 'Saint Lucia' },
  { value: 'saint-vincent-and-the-grenadines', label: 'Saint Vincent and the Grenadines' },
  { value: 'samoa', label: 'Samoa' },
  { value: 'san-marino', label: 'San Marino' },
  { value: 'sao-tome-and-principe', label: 'Sao Tome and Principe' },
  { value: 'saudi-arabia', label: 'Saudi Arabia' },
  { value: 'senegal', label: 'Senegal' },
  { value: 'serbia', label: 'Serbia' },
  { value: 'seychelles', label: 'Seychelles' },
  { value: 'sierra-leone', label: 'Sierra Leone' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'slovakia', label: 'Slovakia' },
  { value: 'slovenia', label: 'Slovenia' },
  { value: 'solomon-islands', label: 'Solomon Islands' },
  { value: 'somalia', label: 'Somalia' },
  { value: 'south-africa', label: 'South Africa' },
  { value: 'south-korea', label: 'South Korea' },
  { value: 'south-sudan', label: 'South Sudan' },
  { value: 'spain', label: 'Spain' },
  { value: 'sri-lanka', label: 'Sri Lanka' },
  { value: 'sudan', label: 'Sudan' },
  { value: 'suriname', label: 'Suriname' },
  { value: 'sweden', label: 'Sweden' },
  { value: 'switzerland', label: 'Switzerland' },
  { value: 'syria', label: 'Syria' },
  { value: 'taiwan', label: 'Taiwan' },
  { value: 'tajikistan', label: 'Tajikistan' },
  { value: 'tanzania', label: 'Tanzania' },
  { value: 'thailand', label: 'Thailand' },
  { value: 'togo', label: 'Togo' },
  { value: 'tonga', label: 'Tonga' },
  { value: 'trinidad-and-tobago', label: 'Trinidad and Tobago' },
  { value: 'tunisia', label: 'Tunisia' },
  { value: 'turkey', label: 'Turkey' },
  { value: 'turkmenistan', label: 'Turkmenistan' },
  { value: 'tuvalu', label: 'Tuvalu' },
  { value: 'uganda', label: 'Uganda' },
  { value: 'ukraine', label: 'Ukraine' },
  { value: 'united-arab-emirates', label: 'United Arab Emirates' },
  { value: 'united-kingdom', label: 'United Kingdom' },
  { value: 'united-states', label: 'United States' },
  { value: 'uruguay', label: 'Uruguay' },
  { value: 'uzbekistan', label: 'Uzbekistan' },
  { value: 'vanuatu', label: 'Vanuatu' },
  { value: 'vatican-city', label: 'Vatican City' },
  { value: 'venezuela', label: 'Venezuela' },
  { value: 'vietnam', label: 'Vietnam' },
  { value: 'yemen', label: 'Yemen' },
  { value: 'zambia', label: 'Zambia' },
  { value: 'zimbabwe', label: 'Zimbabwe' },
] as const;

export function AccountDetailsForm(): React.JSX.Element {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>First name</InputLabel>
                <OutlinedInput defaultValue="Sofia" label="First name" name="firstName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Last name</InputLabel>
                <OutlinedInput defaultValue="Rivers" label="Last name" name="lastName" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue="sofia@tranchant.tech" label="Email address" name="email" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Country</InputLabel>
                <Select defaultValue="france" label="Country" name="country" variant="outlined">
                  {countries.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained">Save details</Button>
        </CardActions>
      </Card>
    </form>
  );
}