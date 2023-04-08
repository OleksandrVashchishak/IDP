import paper from '../../assets/img/paper-air.svg'
import letterFirst from '../../assets/img/letter-1.svg'
import letterSecond from '../../assets/img/letter-2.svg'
import letterThird from '../../assets/img/letter-3.svg'

export const Hero = () => {
    return (
        <div className="sub-header__bg page-section-1">
            <img src={paper} alt="" className="paper-air" />
            <div className="container container-relative">
                <div className="sub-header">
                    <h3 className="sub-header__title">
                        <span className="sub-header__title--color"> WE GET YOU</span> Agency
                        provides best digital solutions
                    </h3>
                    <p className="sub-header__subtitle">
                        Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut
                        fugit, sed quia consequuntur magni dolores eos qui ratione
                    </p>
                </div>
                <img src={letterFirst} alt="letter" className="sub-header__letter-1 sub-header__letter" />
                <img src={letterSecond} alt="letter" className="sub-header__letter-2 sub-header__letter" />
                <img src={letterThird} alt="letter" className="sub-header__letter-3 sub-header__letter" />
            </div>
        </div>
    )
}