const baseConfig = {
    1: {spawnInterval: 800, scoresPerAction: 5},
    2: {spawnInterval: 1500, scoresPerAction: 5},
    3: {spawnInterval: 2000, scoresPerAction: 10},
    4: {spawnInterval: 2200, scoresPerAction: 12},
    5: {spawnInterval: 2400, scoresPerAction: 15},
    6: {spawnInterval: 2600, scoresPerAction: 18},
    7: {spawnInterval: 2800, scoresPerAction: 20},
    default: {spawnInterval: 3000, scoresPerAction: 25}
};

const levelWords = {
    EN: {
        1: [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
            'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
            'u', 'v', 'w', 'x', 'y', 'z'
        ],
        2: [
            'an', 'as', 'at', 'be', 'by', 'do', 'go', 'he', 'if', 'in', 'is', 'it', 'me', 'my', 'no', 'of', 'on', 'or', 'so', 'to', 'up', 'us', 'we',
            'and', 'ant', 'any', 'are', 'arm', 'art', 'ask', 'bad', 'bag', 'bar', 'bat', 'bed', 'bee', 'big', 'bit', 'box', 'boy', 'bus', 'but',
            'can', 'cap', 'car', 'cat', 'cow', 'cup', 'cut', 'day', 'dog', 'dry', 'ear', 'eat', 'egg', 'end', 'eye', 'far', 'fat', 'few', 'fig',
            'fit', 'fly', 'for', 'fun', 'get', 'god', 'gun', 'had', 'has', 'hat', 'her', 'him', 'his', 'hot', 'how', 'ice', 'ill', 'jam', 'job',
            'joy', 'key', 'leg', 'let', 'lie', 'lip', 'low', 'man', 'map', 'may', 'men', 'mix', 'net', 'new', 'now', 'nut', 'old', 'one', 'out',
            'own', 'pay', 'pen', 'pet', 'pie', 'pig', 'pin', 'pop', 'pot', 'put', 'red', 'run', 'sad', 'sat', 'see', 'set', 'she', 'sit', 'sky'
        ],
        3: [
            'able', 'also', 'area', 'back', 'ball', 'bank', 'base', 'bear', 'beat', 'been', 'beer', 'bell', 'belt', 'bend', 'best', 'bill', 'bird', 'blow', 'blue', 'boat', 'body', 'book', 'born', 'both', 'bowl', 'burn', 'call', 'calm', 'camp', 'card', 'care', 'case', 'cash', 'cast', 'city', 'club', 'coat', 'cold', 'come', 'cook', 'cool', 'copy', 'corn', 'cost', 'crew', 'crop', 'dark', 'date', 'deal', 'dear', 'deep', 'desk', 'dial', 'diet', 'door', 'down', 'draw', 'drop', 'drum', 'duck', 'dust', 'each', 'earn', 'east', 'easy', 'edge', 'else', 'even', 'ever', 'face', 'fact', 'fail', 'fall', 'farm', 'fast', 'fear', 'feed', 'feel', 'feet', 'file', 'fill', 'film', 'find', 'fine', 'fire', 'fish', 'five', 'flat', 'flow', 'food', 'foot', 'form', 'free', 'from', 'fuel', 'full', 'fund', 'gain', 'game'
        ],
        4: [
            'about', 'above', 'acorn', 'actor', 'adapt', 'admit', 'adopt', 'adult', 'after', 'again', 'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'allow', 'alone', 'along', 'alter', 'amend', 'among', 'angel', 'anger', 'angle', 'angry', 'apart', 'apple', 'apply', 'argue', 'arise', 'array', 'aside', 'asset', 'audio', 'avoid', 'award', 'aware', 'awful', 'badge', 'baker', 'bases', 'basic', 'basis', 'beach', 'beans', 'beard', 'beast', 'begin', 'being', 'belly', 'below', 'bench', 'bible', 'birth', 'black', 'blade', 'blame', 'blank', 'blast', 'bless', 'blind', 'block', 'blood', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'bread', 'break', 'breed', 'brick', 'brief', 'bring', 'broad', 'broke', 'brown', 'brush', 'build', 'built', 'buyer', 'cabin', 'cable', 'cafe', 'cages'
        ],
        5: [
            'accept', 'access', 'across', 'action', 'active', 'actual', 'adding', 'advice', 'advise', 'affect', 'afford', 'agency', 'agenda', 'almost', 'always', 'amount', 'animal', 'annual', 'answer', 'anyone', 'anyway', 'appeal', 'appear', 'around', 'arrest', 'arrive', 'artist', 'aspect', 'assess', 'assist', 'assume', 'attack', 'attend', 'august', 'author', 'autumn', 'avenue', 'backed', 'barely', 'battle', 'beauty', 'became', 'become', 'before', 'behalf', 'behave', 'behind', 'belief', 'belong', 'better', 'beyond', 'bishop', 'border', 'bottle', 'bottom', 'bought', 'branch', 'breath', 'bridge', 'bright', 'broken', 'budget', 'burden', 'butter', 'button', 'camera', 'campus', 'cancel', 'cancer', 'cannot', 'carbon', 'career', 'castle', 'casual', 'caught', 'center', 'chance', 'change', 'charge', 'choice', 'choose', 'church', 'circle', 'client', 'closed', 'closer', 'coffee', 'column', 'combat', 'coming', 'common', 'comply', 'copper', 'corner', 'costly'
        ],
        6: [
            'ability', 'absence', 'academy', 'account', 'accused', 'achieve', 'acquire', 'address', 'advance', 'adverse', 'advised', 'adviser', 'against', 'airline', 'airport', 'alcohol', 'alleged', 'already', 'amazing', 'analyst', 'ancient', 'another', 'anxiety', 'anxious', 'anybody', 'applied', 'arrange', 'arrival', 'article', 'assault', 'attempt', 'attract', 'auction', 'average', 'backing', 'balance', 'balloon', 'banking', 'barrier', 'battery', 'bearing', 'beating', 'because', 'bedroom', 'believe', 'beloved', 'beneath', 'benefit', 'besides', 'between', 'billion', 'binding', 'brother', 'brought', 'burning', 'cabinet', 'calcium', 'calling', 'capable', 'capital', 'captain', 'caption', 'carbon', 'careful', 'carrier', 'caution', 'ceiling', 'central', 'ceramic', 'certain', 'chamber', 'channel', 'chapter', 'charity', 'charlie', 'charter', 'cheaper', 'checked', 'cheese', 'chicken', 'chronic', 'circuit', 'citizen', 'clarify', 'classic', 'climate', 'closing', 'closure', 'clothes', 'coastal', 'collect'
        ],
        7: [
            'absolute', 'abstract', 'academy', 'acceptor', 'accident', 'accuracy', 'accurate', 'activist', 'activity', 'addition', 'adequate', 'adjacent', 'adoption', 'advanced', 'advocate', 'aircraft', 'airline', 'airport', 'alliance', 'although', 'aluminum', 'analysis', 'ancestor', 'announce', 'annually', 'anointed', 'anything', 'anywhere', 'apparent', 'appeared', 'appendix', 'approach', 'approval', 'arguably', 'arranged', 'arrival', 'artistic', 'assembly', 'assessed', 'assorted', 'assuming', 'athletic', 'attached', 'attitude', 'attorney', 'attracts', 'audience', 'autonomy', 'available', 'average', 'aviation', 'backbone', 'backdrop', 'bacteria', 'balanced', 'bargains', 'barriers', 'baseball', 'baseline', 'battered', 'bearing', 'beatings', 'becoming', 'bedroom', 'believed', 'believes', 'bellyful', 'beloveds', 'benefits', 'benjamin', 'besidest', 'bestiary', 'betrayal', 'between', 'bicycles', 'biggests', 'birthday', 'blankets', 'blessing', 'blocking', 'bluebird', 'boarders', 'boasting', 'boating', 'boldness', 'bombings'
        ],
        default: [
            'population', 'government', 'television', 'California', 'Australian',
            'production', 'background', 'Washington', 'considered', 'basketball',
            'throughout', 'occupation', 'conference', 'management', 'technology',
            'experience', 'conditions', 'activities', 'additional', 'discussion',
            'collection', 'individual', 'everything', 'commercial', 'protection',
            'employment', 'particular', 'facilities', 'statistics', 'investment',
            'associated', 'foundation', 'navigation', 'operations', 'understand',
            'especially', 'enterprise', 'resolution', 'components', 'assistance',
            'membership', 'television', 'restaurant', 'evaluation', 'literature',
            'definition', 'networking', 'guidelines', 'directions', 'successful',
            'publishing', 'historical', 'scientific', 'monitoring', 'dictionary'
        ]
    },
    RU: {
        1: [
            'а', 'б', 'в', 'г', 'д', 'е', 'ж', 'з', 'и',
            'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т',
            'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь',
            'э', 'ю', 'я'
        ],
        2: [
            'он', 'мы', 'ты', 'да', 'нет', 'дом', 'кот', 'лес', 'мир', 'год',
            'раз', 'два', 'три', 'вот', 'там', 'тут', 'как', 'что', 'это', 'где',
            'кто', 'чем', 'при', 'под', 'над', 'без', 'для', 'или', 'все', 'уже'
        ],
        3: [
            'мама', 'папа', 'окно', 'стол', 'дверь', 'книга', 'ручка', 'вода', 'земля', 'небо',
            'друг', 'враг', 'утро', 'вечер', 'ночь', 'день', 'город', 'река', 'озеро', 'лес',
            'птица', 'рыба', 'зверь', 'яблоко', 'груша', 'молоко', 'хлеб', 'сыр', 'мясо', 'суп'
        ],
        4: [
            'работа', 'школа', 'учитель', 'ученик', 'комната', 'квартира', 'машина', 'поезд', 'автобус', 'дорога',
            'погода', 'зима', 'весна', 'лето', 'осень', 'цветок', 'трава', 'дерево', 'песок', 'камень',
            'голова', 'рука', 'нога', 'глаз', 'рот', 'нос', 'сердце', 'живот', 'спина', 'плечо'
        ],
        5: [
            'путешествие', 'разговор', 'предмет', 'событие', 'история', 'музыка', 'картина', 'фотография', 'телефон', 'компьютер',
            'интернет', 'программа', 'задание', 'вопрос', 'ответ', 'решение', 'письмо', 'газета', 'журнал', 'новость',
            'праздник', 'подарок', 'родители', 'ребёнок', 'семья', 'друзья', 'отношения', 'чувства', 'эмоции', 'улыбка'
        ],
        6: [
            'образование', 'университет', 'литература', 'искусство', 'архитектура', 'философия', 'психология', 'экономика', 'политика', 'технологии',
            'экология', 'медицина', 'биология', 'физика', 'химия', 'математика', 'география', 'история', 'социология', 'антропология'
        ],
        7: [
            'интеллектуальный', 'ответственность', 'саморазвитие', 'взаимопонимание', 'мировоззрение', 'предпринимательство', 'самоорганизация',
            'коммуникабельность', 'целеустремлённость', 'многообразие', 'взаимозависимость', 'самоидентификация', 'инновационность', 'реализация',
            'самоанализ', 'мотивация', 'рефлексия', 'перспектива', 'инициатива', 'конструктивность'
        ],
        default: [
            'государство', 'образование', 'информация', 'коммуникация', 'организация', 'представление', 'взаимодействие',
            'инфраструктура', 'конституция', 'демократия', 'институция', 'регуляция', 'интерпретация', 'реализация',
            'интеграция', 'координация', 'стратегия', 'перспектива', 'идентификация', 'рационализация'
        ]
    }
};

export function getConfig(language, level) {
    const wordsForLang = levelWords[language] || levelWords.en;
    const words = wordsForLang[level] || wordsForLang.default;
    const config = baseConfig[level] || baseConfig.default;
    return { ...config, words };
}