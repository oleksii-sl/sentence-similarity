import stringSimilarity from "string-similarity";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMars, faVenus} from "@fortawesome/free-solid-svg-icons";
import React from "react";


const astrological_icons = {
    Aries: '♈',
    Taurus: '♉',
    Gemini: '♊',
    Cancer: '♋',
    Leo: '♌',
    Virgo: '♍',
    Libra: '♎',
    Scorpius: '♏',
    Sagittarius: '♐',
    Capricorn: '♑',
    Aquarius: '♒',
    Pisces: '♓'
};

const AuthorDetails = ({id, gender, industry, astrological_sign, posted_on}) => {
    const isMale = (gender === 'male');
    const matches = stringSimilarity.findBestMatch(
        astrological_sign, Object.keys(astrological_icons)
    );
    const bestMatchSign = matches.bestMatch.target;
    return <div className="float-left text-left d-inline-block">
        <div>Posted on {posted_on}</div>
        <div>Author id: {id}</div>
        <div>Gender: <FontAwesomeIcon icon={isMale ? faMars : faVenus}
                                      color={isMale ? 'red' : 'skyblue'}/></div>
        <div>Industry: {industry}</div>
        <div>
            Astrological sign: {bestMatchSign} &nbsp;
            <span style={{fontSize: '32px'}}>{astrological_icons[bestMatchSign]}</span>
        </div>
    </div>
};

export default AuthorDetails;