/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { 
    faUserSecret, 
    faPlus, 
    faSearch, 
    faChevronRight,
    faBook,
    faHistory,
    faChartBar,
    faCircle,
    faEye,
    faPencil,
    faChevronDown,
    faRightFromBracket,
    faUser
} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(
    faUserSecret,
    faPlus,
    faSearch,
    faChevronRight,
    faBook,
    faHistory,
    faChartBar,
    faCircle,
    faEye,
    faPencil,
    faChevronDown,
    faRightFromBracket,
    faUser
)

export { FontAwesomeIcon } 