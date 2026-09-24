'use strict';
/* =========================================
   1. CONFIGURACIÓN
========================================= */
const CLAVE_STORAGE = 'lumetico_estado_v2';
const SEGUNDOS_PUERTA = 20;

const CATS = {
    seguridad: { nombre: 'Seguridad de la Información', corto: 'Seguridad', icono: '🔐' },
    clima:     { nombre: 'Clima Laboral',               corto: 'Clima',     icono: '🌱' },
    poder:     { nombre: 'Relaciones de Poder',         corto: 'Poder',     icono: '⚖️' }
};

const PRINCIPIOS = {
    H: '🤝 Honestidad y Respeto',
    J: '⚖️ Justicia y Equidad',
    A: '🛠️ Crecimiento ante el Error'
};

const ETAPAS = [
    { min: 0, nombre: 'Oruga Curiosa',        desc: 'Apenas empieza a descubrir su luz.' },
    { min: 2, nombre: 'Capullo en Reflexión', desc: 'Cada decisión íntegra la transforma por dentro.' },
    { min: 5, nombre: 'Luciérnaga Íntegra',   desc: 'Ya ilumina el camino de su equipo.' },
    { min: 9, nombre: 'Faro Radiante',        desc: 'Su ejemplo guía a toda la organización.' }
];

/* =========================================
   2. BANCO DE DILEMAS
   - 18 situaciones base (6 por categoría)
   - 8 consecuencias encadenadas (efecto mariposa)
========================================= */
const DILEMAS = [
    /* ---------- SEGURIDAD DE LA INFORMACIÓN ---------- */
    { id: 's1', cat: 'seguridad', principio: 'A', consecuencia: 'm1',
      situacion: 'Por un descuido ejecutaste un script que alteró registros importantes en la base de datos de la empresa. Nadie se ha dado cuenta aún.',
      correcta: 'Aplicar A-R-C: avisar de inmediato a tu líder, asumir el error y proponer cómo reparar los datos.',
      incorrecta: 'Ocultarlo: limpiar tu historial de comandos y esperar a que soporte lo resuelva sin decir nada.',
      explicacion: 'El Crecimiento ante el Error exige asumir sin excusas. Cada hora de silencio agranda el daño técnico y, sobre todo, rompe la confianza del equipo.' },
    { id: 's2', cat: 'seguridad', principio: 'H', consecuencia: 'm2',
      situacion: 'Estás de vacaciones y un compañero te escribe: “Pásame tu contraseña del sistema, necesito cerrar un reporte urgente del cliente”.',
      correcta: 'Negarte con amabilidad y pedirle que solicite un acceso temporal a TI o a tu líder.',
      incorrecta: 'Enviársela por chat: es de confianza y no quieres que el cliente se moleste.',
      explicacion: 'Las credenciales son personales e intransferibles. Todo lo que se haga con tu usuario queda registrado a tu nombre, aunque no hayas sido tú.' },
    { id: 's3', cat: 'seguridad', principio: 'H',
      situacion: 'Recibes un correo urgente que parece del Director General: pide que compres tarjetas de regalo para un cliente y le envíes los códigos hoy mismo.',
      correcta: 'No responder, verificar la solicitud por otro canal y reportar el correo al equipo de seguridad.',
      incorrecta: 'Hacer la compra rápido: es el Director y no quieres quedar mal.',
      explicacion: 'La urgencia y la autoridad son las armas favoritas del phishing. Verificar no es desconfiar del jefe: es proteger a la empresa.' },
    { id: 's4', cat: 'seguridad', principio: 'H',
      situacion: 'En el parqueo encuentras una memoria USB con una etiqueta que dice “Planilla de salarios 2026”.',
      correcta: 'Entregarla sin conectarla al área de TI o de seguridad para que la gestionen.',
      incorrecta: 'Conectarla a tu computadora para ver de quién es y devolverla tú mismo.',
      explicacion: 'Los dispositivos “olvidados” son un truco clásico para infectar redes. Y aunque fuera real, revisar salarios ajenos viola la confidencialidad y el respeto.' },
    { id: 's5', cat: 'seguridad', principio: 'H', consecuencia: 'm3',
      situacion: 'Quieres avanzar trabajo el fin de semana y piensas enviarte la base de datos de clientes a tu correo personal.',
      correcta: 'Usar solo las herramientas autorizadas (VPN o equipo corporativo) o pedir una alternativa segura.',
      incorrecta: 'Reenviártela a tu Gmail: es solo por dos días y luego la borras.',
      explicacion: 'Los datos de clientes no son tuyos: te fueron confiados. Sacarlos de los canales autorizados los expone aunque tu intención sea buena.' },
    { id: 's6', cat: 'seguridad', principio: 'J',
      situacion: 'En una reunión social, un amigo que trabaja en la competencia te pregunta “por curiosidad” cuándo lanzarán su nuevo producto.',
      correcta: 'Responder con cortesía que es información confidencial y cambiar de tema.',
      incorrecta: 'Darle solo “detalles generales” de la fecha: al fin y al cabo es tu amigo.',
      explicacion: 'La confidencialidad no depende de la confianza personal. Un “detalle general” puede darle una ventaja injusta a otra empresa.' },

    /* ---------- CLIMA LABORAL ---------- */
    { id: 'c1', cat: 'clima', principio: 'H',
      situacion: 'Escuchas en el pasillo que van a despedir a una compañera de tu equipo por bajo rendimiento.',
      correcta: 'Detener la cadena: no repetir el rumor y promover que la información llegue por canales oficiales.',
      incorrecta: 'Escribirle para “advertirle” y comentarlo con otros colegas por si acaso.',
      explicacion: 'Propagar información no confirmada genera ansiedad, daña reputaciones y deteriora el clima laboral. La honestidad empieza por no amplificar rumores.' },
    { id: 'c2', cat: 'clima', principio: 'H',
      situacion: 'Un colega entrega un reporte con varias deficiencias que retrasan tu propio trabajo.',
      correcta: 'Hablar con él en privado y darle retroalimentación enfocada en el proceso, no en la persona.',
      incorrecta: 'Exponer sus errores en el grupo de WhatsApp de la oficina para que todos lo vean.',
      explicacion: 'Regla de oro: elogiamos en público, corregimos en privado. La crítica constructiva hace crecer; la humillación solo destruye.' },
    { id: 'c3', cat: 'clima', principio: 'J',
      situacion: 'Llega un compañero nuevo de otro país. Notas que el equipo lo deja fuera de los almuerzos y del chat “porque no entiende nuestras bromas”.',
      correcta: 'Invitarlo tú mismo y proponer al equipo que lo integren en los espacios de trabajo.',
      incorrecta: 'No meterte: ya se adaptará con el tiempo, no es tu responsabilidad.',
      explicacion: 'La exclusión silenciosa también es una forma de injusticia. La equidad se construye con gestos concretos de inclusión.' },
    { id: 'c4', cat: 'clima', principio: 'H',
      situacion: 'En una reunión, varios colegas hacen bromas sobre la apariencia física de una compañera. Ella se ríe, pero se nota incómoda.',
      correcta: 'Redirigir la conversación con respeto y, después, preguntarle en privado cómo se siente.',
      incorrecta: 'Reírte también para no parecer “aguafiestas”.',
      explicacion: 'El respeto a la dignidad no es negociable. Quien calla ante una burla la normaliza; una intervención asertiva protege a todos.' },
    { id: 'c5', cat: 'clima', principio: 'A', consecuencia: 'm4',
      situacion: 'Olvidaste enviar un archivo clave y tu equipo no llegó a la fecha de entrega. El gerente culpa al equipo en general.',
      correcta: 'Pedir la palabra, reconocer que el fallo fue tuyo y proponer cómo recuperar el tiempo.',
      incorrecta: 'Quedarte en silencio: si la culpa es de todos, no es de nadie.',
      explicacion: 'A-R-C: Asumir, Reparar y Cerrar. Diluir tu error en el grupo es injusto con tus compañeros y te priva de crecer.' },
    { id: 'c6', cat: 'clima', principio: 'H', consecuencia: 'm5',
      situacion: 'Un compañero marca horas extra que no trabajó y te pide que, si alguien pregunta, confirmes que se quedó contigo.',
      correcta: 'Negarte con respeto y animarlo a corregir su registro antes de que se convierta en un problema mayor.',
      incorrecta: 'Cubrirlo: es tu amigo y “todos lo hacen de vez en cuando”.',
      explicacion: 'La lealtad mal entendida se vuelve complicidad. Ser honesto con él también es una forma de cuidarlo.' },

    /* ---------- RELACIONES DE PODER ---------- */
    { id: 'p1', cat: 'poder', principio: 'J',
      situacion: 'Tu jefe te pide exponer ante los directivos un proyecto que en realidad fue idea y trabajo principal de un compañero.',
      correcta: 'Exponerlo, pero reconocer públicamente quién fue el autor de la idea.',
      incorrecta: 'Aceptar los aplausos y adueñarte del proyecto para asegurar un ascenso.',
      explicacion: 'La Justicia exige dar mérito a quien lo merece. Liderar es inspirar con el ejemplo, no apropiarse del trabajo ajeno.' },
    { id: 'p2', cat: 'poder', principio: 'J', consecuencia: 'm6',
      situacion: 'Un proveedor te ofrece un “regalo corporativo” bastante costoso a cambio de que agilices el pago de sus facturas.',
      correcta: 'Rechazar el regalo con amabilidad, explicando que va contra las políticas de la empresa.',
      incorrecta: 'Aceptarlo: “igual se le iba a pagar, no le hago daño a nadie”.',
      explicacion: 'Un regalo a cambio de un trato preferente es un soborno, aunque se disfrace de cortesía. La justicia exige decisiones libres de favores.' },
    { id: 'p3', cat: 'poder', principio: 'H', consecuencia: 'm7',
      situacion: 'Tu gerente te pide “ajustar un poco” las cifras del trimestre para que el equipo alcance el bono.',
      correcta: 'Negarte y ofrecer presentar los números reales junto con un plan para mejorar el siguiente trimestre.',
      incorrecta: 'Ajustarlas: la orden viene de arriba y el equipo necesita el bono.',
      explicacion: 'Una orden no convierte en correcto algo deshonesto. Manipular cifras engaña a la empresa y te expone a ti, no solo a quien lo pidió.' },
    { id: 'p4', cat: 'poder', principio: 'J',
      situacion: 'Te acaban de ascender a líder. Tu mejor amigo en el equipo espera que le asignes el proyecto más importante del año.',
      correcta: 'Asignarlo con criterios claros de mérito y explicarlos a todo el equipo, incluido tu amigo.',
      incorrecta: 'Dárselo a tu amigo: confías en él más que en nadie.',
      explicacion: 'El favoritismo, incluso bienintencionado, erosiona la confianza del equipo. Los criterios transparentes protegen la relación y la justicia.' },
    { id: 'p5', cat: 'poder', principio: 'H',
      situacion: 'Una compañera junior te confía que un director le hace comentarios personales e invitaciones insistentes. Teme represalias si habla.',
      correcta: 'Escucharla sin juzgar, informarle de los canales confidenciales y ofrecerte a acompañarla.',
      incorrecta: 'Aconsejarle que lo ignore: “él tiene mucho poder y es mejor no buscar problemas”.',
      explicacion: 'El acoso se sostiene en el silencio y en la diferencia de poder. Acompañar y activar canales seguros es proteger la dignidad de las personas.' },
    { id: 'p6', cat: 'poder', principio: 'J',
      situacion: 'Tu jefe te pide contratar a su sobrino para una vacante, saltándote el proceso de selección.',
      correcta: 'Sugerir con respeto que el sobrino participe en el proceso con los mismos criterios que los demás.',
      incorrecta: 'Contratarlo directamente: contradecir al jefe podría costarte caro.',
      explicacion: 'La equidad exige igualdad de oportunidades. Un proceso transparente protege a la empresa, a los candidatos y al propio sobrino.' },

    /* ---------- CONSECUENCIAS (EFECTO MARIPOSA) ---------- */
    { id: 'm1', cat: 'seguridad', principio: 'A', esConsecuencia: true, consecuencia: 'm1b',
      gancho: 'Ocultar el error no lo borró. Se acerca una auditoría…',
      situacion: 'Auditoría sorpresa: dos semanas después, TI detecta los registros alterados y abre una investigación. El auditor te pregunta directamente si sabes algo.',
      correcta: 'Contar la verdad ahora, entregar toda la información y proponer un plan de reparación.',
      incorrecta: 'Negarlo y sugerir que probablemente fue un fallo del sistema.',
      explicacion: 'Nunca es tarde para aplicar A-R-C. Una mentira sostenida convierte un error técnico en una falta de integridad, que es mucho más grave.' },
    { id: 'm1b', cat: 'seguridad', principio: 'J', esConsecuencia: true,
      gancho: 'Los registros del servidor no mienten…',
      situacion: 'Los registros del servidor muestran tu usuario. Tu líder te cita a una reunión y comenta que un practicante también tenía acceso.',
      correcta: 'Asumir tu responsabilidad, disculparte y aceptar las medidas correctivas.',
      incorrecta: 'Dejar que sospechen del practicante: nadie podrá probar lo contrario.',
      explicacion: 'Culpar a alguien más vulnerable es una injusticia grave que multiplica el daño. Asumir, aunque sea tarde, es el único camino para reparar.' },
    { id: 'm2', cat: 'seguridad', principio: 'H', esConsecuencia: true,
      gancho: 'Tu usuario quedó en manos de otra persona…',
      situacion: 'Seguridad detecta que desde tu usuario se descargó la base completa de clientes mientras estabas de vacaciones. Te preguntan si compartiste tu contraseña.',
      correcta: 'Reconocer que la compartiste, cambiarla de inmediato y colaborar con la investigación.',
      incorrecta: 'Negarlo: si admites que la compartiste, te van a sancionar.',
      explicacion: 'Ocultar la verdad impide contener la fuga a tiempo. La honestidad en un incidente de seguridad protege a los clientes, que son los más afectados.' },
    { id: 'm3', cat: 'seguridad', principio: 'A', esConsecuencia: true,
      gancho: 'Los datos salieron de la empresa… y alguien más los vio.',
      situacion: 'Tu correo personal fue hackeado y los datos de clientes que reenviaste aparecen expuestos en internet.',
      correcta: 'Reportarlo de inmediato al equipo de seguridad para activar el protocolo de incidentes.',
      incorrecta: 'Borrar los correos y esperar que nadie relacione la filtración contigo.',
      explicacion: 'En una filtración cada minuto cuenta: avisar a tiempo permite proteger a los clientes. Asumir es lo único que puede reducir el daño.' },
    { id: 'm4', cat: 'clima', principio: 'J', esConsecuencia: true,
      gancho: 'Tu silencio tuvo un costo para alguien más…',
      situacion: 'Por el retraso, el gerente anuncia que recortará el bono del equipo y señala a un compañero como el probable responsable.',
      correcta: 'Hablar ahora con el gerente, aclarar que el error fue tuyo y pedir que no se castigue a otros.',
      incorrecta: 'Seguir callado: ya pasó y hablar ahora solo empeoraría las cosas.',
      explicacion: 'Permitir que otro pague por tu error es una injusticia. Nunca es tarde para cerrar el ciclo con la verdad.' },
    { id: 'm5', cat: 'clima', principio: 'H', esConsecuencia: true,
      gancho: 'Recursos Humanos empieza a hacer preguntas…',
      situacion: 'RR. HH. revisa los registros de acceso al edificio y encuentra inconsistencias. Te preguntan si tu compañero se quedó contigo esas noches.',
      correcta: 'Decir la verdad con respeto, sin agregar juicios sobre tu compañero.',
      incorrecta: 'Confirmar la versión de tu compañero para no traicionarlo.',
      explicacion: 'Mentir por otro te convierte en parte de la falta. La verdad dicha con respeto es la forma más alta de lealtad con la organización y contigo.' },
    { id: 'm6', cat: 'poder', principio: 'J', esConsecuencia: true,
      gancho: 'Ese regalo no era gratis…',
      situacion: 'El proveedor ahora te pide aprobar una factura inflada y te recuerda, en tono de broma, “el regalito que aceptaste”.',
      correcta: 'Reportar la situación a Cumplimiento, devolver el regalo y no aprobar la factura.',
      incorrecta: 'Aprobarla para evitar que se sepa lo del regalo.',
      explicacion: 'Así funciona la corrupción: un pequeño favor se convierte en chantaje. Reportar a tiempo te protege y corta la cadena.' },
    { id: 'm7', cat: 'poder', principio: 'H', esConsecuencia: true,
      gancho: 'Los números alterados llamaron la atención…',
      situacion: 'Una auditoría externa detecta la discrepancia en las cifras. Tu gerente te pide que digas que fue un error de fórmula tuyo.',
      correcta: 'Contar la verdad sobre la instrucción recibida y aportar la documentación que tengas.',
      incorrecta: 'Cargar con la culpa como te pidió: es tu jefe y te lo “compensará”.',
      explicacion: 'Encubrir una falta ajena solo agranda la mentira. La honestidad ante una auditoría protege tu integridad y la de la empresa.' }
];
const DIL = Object.fromEntries(DILEMAS.map(d => [d.id, d]));

/* =========================================
   3. MOTOR DE EL FARO (orden = prioridad)
========================================= */
const FARO = {
    acoso: { etiqueta: 'Acoso u hostigamiento', chip: 'poder',
        claves: ['acoso', 'acosa', 'hostig', 'insinu', 'me toca', 'me toco', 'tocarme', 'mi cuerpo', 'invita a salir', 'insiste', 'amenaz', 'intimid', 'me grita', 'humill', 'sexual'],
        diagnostico: 'Lo que describes puede constituir acoso u hostigamiento. No es tu culpa y no tienes que enfrentarlo en soledad.',
        pasos: ['Documenta lo ocurrido: fechas, lugares, mensajes y posibles testigos.', 'Busca un canal seguro: RR. HH., la línea ética confidencial o una persona de confianza con autoridad.', 'Si en algún momento sientes que tu integridad física está en riesgo, busca ayuda inmediata con las autoridades.'],
        canal: 'Línea ética confidencial o Recursos Humanos',
        resumen: 'Documentar los hechos y activar un canal confidencial.',
        frases: ['Tu dignidad no se negocia. Pedir ayuda es un acto de valentía.', 'El silencio protege al agresor; tu voz protege a todos.'] },
    discriminacion: { etiqueta: 'Trato desigual', chip: 'clima',
        claves: ['discrimin', 'racis', 'machis', 'por ser mujer', 'por ser hombre', 'por mi edad', 'mi origen', 'mi acento', 'religion', 'embaraz', 'indigena', 'orientacion', 'discapacidad'],
        diagnostico: 'Parece que hay un trato desigual por características personales. La equidad es un principio central de nuestra cultura.',
        pasos: ['Registra hechos concretos: qué se dijo o hizo, cuándo y frente a quién.', 'Si te sientes seguro, expresa de forma asertiva cómo te afecta ese trato.', 'Reporta a RR. HH. o a Cumplimiento: la discriminación nunca es “solo una broma”.'],
        canal: 'Recursos Humanos o Comité de Ética',
        resumen: 'Registrar los hechos y reportar el trato desigual.',
        frases: ['La diversidad no se tolera: se celebra.', 'Nadie debería esconder quién es para ser respetado.'] },
    soborno: { etiqueta: 'Conflicto de interés', chip: 'poder',
        claves: ['regalo', 'soborno', 'proveedor', 'comision', 'mordida', 'dinero', 'favor', 'cena', 'viaje', 'licitacion', 'conflicto de interes'],
        diagnostico: 'Hay señales de un posible conflicto de interés. Cuando alguien ofrece algo a cambio de un trato especial, la imparcialidad está en juego.',
        pasos: ['No aceptes nada que pueda influir, o parecer que influye, en tus decisiones.', 'Declara la situación a tu líder o al área de Cumplimiento aunque la hayas rechazado.', 'Si ya aceptaste algo, devuélvelo y repórtalo cuanto antes: A-R-C también aplica aquí.'],
        canal: 'Área de Cumplimiento',
        resumen: 'Declarar el conflicto de interés a Cumplimiento.',
        frases: ['Tu integridad no tiene precio, y eso es lo que la hace valiosa.', 'Un favor que no puedes contar en voz alta no es un favor: es una deuda.'] },
    seguridad: { etiqueta: 'Seguridad de la información', chip: 'seguridad',
        claves: ['contrasena', 'password', 'clave', 'phishing', 'correo sospechoso', 'enlace', 'link', 'usb', 'datos', 'confidencial', 'informacion', 'base de datos', 'hacke', 'virus', 'filtr'],
        diagnostico: 'Tu consulta involucra la protección de información. Aquí, actuar rápido y por los canales correctos marca toda la diferencia.',
        pasos: ['No abras enlaces ni compartas credenciales hasta verificar la situación.', 'Reporta el incidente a TI o al equipo de seguridad, aunque creas que “no es nada”.', 'Si cometiste un error (un clic, un envío equivocado), dilo de inmediato: cada minuto cuenta.'],
        canal: 'Equipo de TI / Seguridad de la Información',
        resumen: 'Verificar y reportar a Seguridad de la Información.',
        frases: ['La información que te confían vale tanto como la confianza misma.', 'En seguridad, avisar tarde es casi igual que no avisar.'] },
    credito: { etiqueta: 'Reconocimiento del mérito', chip: 'clima',
        claves: ['credito', 'merito', 'mi idea', 'mis ideas', 'se llevo', 'robo la idea', 'reconocimiento', 'se adueno', 'como suyas', 'como suyo'],
        diagnostico: 'Que otra persona se atribuya tu trabajo afecta la justicia y la motivación del equipo.',
        pasos: ['Conversa primero en privado con la persona, con calma y hechos concretos.', 'Documenta tus aportes (correos, versiones, fechas) de forma ordenada.', 'Si la situación se repite, plantéalo a tu líder enfocándote en el proceso, no en atacar.'],
        canal: 'Conversación directa y, si persiste, tu líder',
        resumen: 'Conversación privada y documentar los aportes.',
        frases: ['El mérito se defiende con hechos, no con rencor.', 'Reconocer al otro nunca apaga tu luz; la multiplica.'] },
    error: { etiqueta: 'Crecimiento ante el error', chip: 'general',
        claves: ['error', 'me equivoque', 'equivoque', 'falle', 'borre', 'olvide', 'cometi', 'se me paso', 'arruine'],
        diagnostico: 'Reconocer que te equivocaste ya es el primer paso de A-R-C. Eso habla muy bien de ti.',
        pasos: ['Asumir: comunica el error a quien corresponda, sin excusas ni culpables.', 'Reparar: propone acciones concretas para corregir el daño.', 'Cerrar: aprende la lección, compártela y suelta la culpa.'],
        canal: 'Tu líder directo',
        resumen: 'Aplicar A-R-C: Asumir, Reparar y Cerrar.',
        frases: ['Un error es solo una lección disfrazada. Asúmelo, repáralo y sigue brillando.', 'Quien reconoce sus errores construye una confianza que nadie le puede quitar.'] },
    rumor: { etiqueta: 'Rumores', chip: 'clima',
        claves: ['rumor', 'chisme', 'dicen que', 'se dice', 'comentan que', 'escuche que', 'radio pasillo'],
        diagnostico: 'Los rumores crecen cuando nadie los detiene. Tú puedes ser quien corte la cadena.',
        pasos: ['No repitas ni amplifiques información que no está confirmada.', 'Si el rumor afecta a alguien, sugiere que consulte fuentes oficiales.', 'Promueve en tu equipo la comunicación directa y transparente.'],
        canal: 'Canales oficiales de comunicación interna',
        resumen: 'Cortar la cadena del rumor y acudir a fuentes oficiales.',
        frases: ['La verdad no necesita susurros.', 'Lo que no dirías frente a la persona, no lo digas a sus espaldas.'] },
    poder: { etiqueta: 'Presión de autoridad', chip: 'poder',
        claves: ['jefe', 'jefa', 'gerente', 'director', 'supervisor', 'me obliga', 'me ordena', 'me pide que', 'me pidio', 'me pidieron', 'me exige', 'ocult', 'no reporte', 'que calle', 'cambie los numeros', 'maquill', 'presion', 'despedir', 'superior'],
        diagnostico: 'Cuando quien pide algo cuestionable tiene autoridad sobre ti, la presión es real. Aun así, una orden no vuelve correcto lo incorrecto.',
        pasos: ['Pide la instrucción por escrito y aclara tus dudas con respeto.', 'Propón una alternativa que cumpla el objetivo sin comprometer la ética.', 'Si la presión continúa, acude a RR. HH. o a la línea ética confidencial.'],
        canal: 'Línea ética confidencial',
        resumen: 'Pedir claridad por escrito y proponer alternativas éticas.',
        frases: ['El respeto a la autoridad nunca exige renunciar a tu integridad.', 'Decir “no” con respeto también es una forma de liderazgo.'] },
    clima: { etiqueta: 'Convivencia en el equipo', chip: 'clima',
        claves: ['companero', 'companera', 'equipo', 'conflicto', 'pelea', 'discusion', 'ambiente', 'colega', 'no me habla', 'excluye', 'broma'],
        diagnostico: 'Los conflictos en el equipo son normales; lo importante es cómo los gestionamos.',
        pasos: ['Busca un momento tranquilo para conversar en privado, sin reproches.', 'Habla desde tu experiencia (“yo siento…”) en lugar de acusar.', 'Si no hay avance, pide la mediación de tu líder o de RR. HH.'],
        canal: 'Conversación privada y, si hace falta, mediación',
        resumen: 'Conversación privada con comunicación asertiva.',
        frases: ['La empatía es tu mejor herramienta: antes de juzgar, conoce el contexto.', 'Elogiamos en público, corregimos en privado.'] },
    general: { etiqueta: 'Orientación general', chip: 'general', claves: [],
        diagnostico: 'He analizado tu situación. Aunque no encaja en un caso típico, nuestros principios siempre pueden orientarte.',
        pasos: ['Pregúntate: ¿me sentiría cómodo si esta decisión se hiciera pública?', 'Evita decidir bajo enojo o presión; date un momento para pensar.', 'Si la duda persiste, consulta a tu líder o a la línea ética.'],
        canal: 'Tu líder o la línea ética',
        resumen: 'Una guía general basada en los principios.',
        frases: ['A veces lo correcto no es lo más fácil, pero es lo que construye un prestigio imborrable.', 'El silencio ante una injusticia te hace cómplice; tu voz asertiva genera el cambio.'] }
};

const FEED_BASE = [
    { tipo: 'clima',     hace: 'hace 4 min',  consulta: 'Mi equipo hace bromas pesadas a un compañero nuevo y nadie dice nada.', respuesta: 'Intervenir con asertividad y ofrecerle apoyo en privado.' },
    { tipo: 'seguridad', hace: 'hace 11 min', consulta: 'Me llegó un correo “del gerente” pidiendo mi contraseña con urgencia.', respuesta: 'No responder, verificar por otro canal y reportarlo como phishing.' },
    { tipo: 'error',     hace: 'hace 26 min', consulta: 'Envié a un cliente un reporte con cifras equivocadas.', respuesta: 'Aplicar A-R-C: avisar al líder, corregir y cerrar con el cliente.' },
    { tipo: 'soborno',   hace: 'hace 42 min', consulta: 'Un proveedor me invitó a cenar justo después de la licitación.', respuesta: 'Declinar la invitación y declararla a Cumplimiento.' },
    { tipo: 'credito',   hace: 'hace 1 h',    consulta: 'Una compañera presenta mis ideas como suyas en las reuniones.', respuesta: 'Conversación privada y documentar los aportes.' },
    { tipo: 'seguridad', hace: 'hace 2 h',    consulta: 'Encontré documentos confidenciales olvidados en la impresora compartida.', respuesta: 'Entregarlos al área responsable sin leerlos ni difundirlos.' },
    { tipo: 'poder',     hace: 'hace 3 h',    consulta: 'Mi jefe quiere que contrate a un conocido sin concurso.', respuesta: 'Proponer que participe en el proceso con los mismos criterios.' },
    { tipo: 'rumor',     hace: 'hace 5 h',    consulta: 'Dicen que habrá recortes y todo el equipo está nervioso.', respuesta: 'No amplificar el rumor y pedir información oficial.' }
];

const SUGERENCIAS = [
    'Un compañero se llevó el crédito de mi idea',
    'Mi jefe me pide que cambie unos números',
    'Me equivoqué y nadie se ha dado cuenta',
    'Un proveedor me ofreció un regalo'
];

const ARC = {
    A: { texto: 'Reconoce el error ante quien corresponde, lo antes posible y sin buscar culpables. La velocidad importa: el silencio multiplica el daño.', ejemplo: '“Fui yo. Esto es lo que pasó y esto es lo que sé hasta ahora.”' },
    R: { texto: 'Propón acciones concretas para corregir las consecuencias, sean técnicas, humanas o económicas. Pide ayuda si la necesitas.', ejemplo: '“Propongo restaurar el respaldo de anoche y revisar hoy mismo los registros afectados.”' },
    C: { texto: 'Extrae la lección, compártela para que no se repita y suelta la culpa. Cerrar también es no guardar rencores contra otros.', ejemplo: '“Documenté lo aprendido y ajustamos el proceso para que no vuelva a pasar.”' }
};

const FRASES_LUMEN = {
    inicio:  ['Mmm… ¿qué camino tomamos?', 'Respira. Piensa en quién se ve afectado.', 'Ética es lo que haces cuando nadie te ve.', 'Confío en tu criterio.'],
    mariposa:['Esto viene de una decisión anterior…', 'Las decisiones tienen eco. Esta es la nuestra.'],
    acierto: ['¡Mi luz crece contigo! ✨', '¡Así se construye confianza!', '¡Brillamos juntos!'],
    error:   ['Uy… mi luz se atenúa.', 'Todos fallamos; lo importante es aprender.', 'Esa puerta tenía sombras…'],
    tiempo:  ['¡El tiempo voló! No decidir también es decidir.']
};

/* =========================================
   4. UTILIDADES Y PERSISTENCIA
========================================= */
const $ = id => document.getElementById(id);
const azar = arr => arr[Math.floor(Math.random() * arr.length)];
const barajar = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const normalizar = t => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const REDUCIR_MOV = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function crear(tag, clase, texto) {
    const e = document.createElement(tag);
    if (clase) e.className = clase;
    if (texto !== undefined) e.textContent = texto;
    return e;
}

const estadoInicial = () => ({ luzTotal: 0, partidas: [], mejor: null, faro: [], run: null, presion: true, ultimo: null, nombre: '' });
let estado = cargarEstado();

function cargarEstado() {
    try {
        const raw = localStorage.getItem(CLAVE_STORAGE);
        return raw ? Object.assign(estadoInicial(), JSON.parse(raw)) : estadoInicial();
    } catch (e) { return estadoInicial(); }
}
function guardar() {
    try { localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado)); } catch (e) { /* almacenamiento no disponible */ }
}

function etapaDe(luz) { let e = 0; ETAPAS.forEach((et, i) => { if (luz >= et.min) e = i; }); return e; }

function toast(msg) {
    const t = crear('div', 'toast', msg);
    $('toasts').appendChild(t);
    setTimeout(() => t.remove(), 3900);
}

function haceCuanto(ts) {
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return 'hace un momento';
    const m = Math.round(s / 60); if (m < 60) return `hace ${m} min`;
    const h = Math.round(m / 60); if (h < 24) return `hace ${h} h`;
    const d = Math.round(h / 24); return `hace ${d} d`;
}

/* =========================================
   5. LUMEN: PERSONAJE SVG QUE EVOLUCIONA
   0 Oruga · 1 Capullo · 2 Luciérnaga · 3 Faro Radiante
========================================= */
let uidLumen = 0;
function lumenSVG(etapa) {
    const id = 'lm' + (++uidLumen);
    const glow = `<filter id="${id}g" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="2.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;
    const ojos = (x1, x2, y, r) => `<g class="ojos">
        <circle cx="${x1}" cy="${y}" r="${r}" fill="#fff"/><circle cx="${x2}" cy="${y}" r="${r}" fill="#fff"/>
        <circle cx="${x1 + 1}" cy="${y + 1}" r="${r * .56}" fill="#0f172a"/><circle cx="${x2 + 1}" cy="${y + 1}" r="${r * .56}" fill="#0f172a"/>
        <circle cx="${x1 + 2}" cy="${y - 1}" r="${r * .22}" fill="#fff"/><circle cx="${x2 + 2}" cy="${y - 1}" r="${r * .22}" fill="#fff"/></g>`;
    let cuerpo = '';

    if (etapa === 0) {
        const segs = [[22, 88, 10], [36, 84, 12], [51, 82, 13], [66, 84, 13], [80, 82, 13]];
        cuerpo = `<defs>${glow}
            <radialGradient id="${id}c" cx=".35" cy=".3"><stop offset="0" stop-color="#d9f99d"/><stop offset=".6" stop-color="#84cc16"/><stop offset="1" stop-color="#3f6212"/></radialGradient>
            <radialGradient id="${id}h" cx=".5" cy=".5"><stop offset="0" stop-color="rgba(250,204,21,.45)"/><stop offset="1" stop-color="rgba(250,204,21,0)"/></radialGradient></defs>
            <circle class="halo" cx="62" cy="76" r="52" fill="url(#${id}h)" opacity=".6"/>
            <ellipse cx="60" cy="102" rx="44" ry="5" fill="rgba(0,0,0,.35)"/>
            ${segs.map(([x, y, r], i) => `<g class="seg" style="animation-delay:${i * .13}s">
                <ellipse cx="${x}" cy="${y + r - 1}" rx="3.2" ry="2.2" fill="#365314"/>
                <circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id}c)" stroke="#365314" stroke-width="1.2"/>
                <circle class="brilla" cx="${x}" cy="${y - r * .35}" r="2.3" fill="#fde047" filter="url(#${id}g)"/></g>`).join('')}
            <g class="seg" style="animation-delay:.7s">
                <path d="M88 54 Q84 40 77 35 M101 53 Q106 39 112 35" stroke="#365314" stroke-width="2.2" fill="none" stroke-linecap="round"/>
                <circle class="brilla" cx="77" cy="35" r="4" fill="#fde047" filter="url(#${id}g)"/>
                <circle class="brilla" cx="112" cy="35" r="4" fill="#fde047" filter="url(#${id}g)" style="animation-delay:.6s"/>
                <circle cx="95" cy="68" r="17" fill="url(#${id}c)" stroke="#365314" stroke-width="1.2"/>
                ${ojos(89, 101, 65, 5)}
                <circle cx="85" cy="74" r="3" fill="#fb7185" opacity=".55"/><circle cx="105" cy="74" r="3" fill="#fb7185" opacity=".55"/>
                <path d="M90 76 Q95 81 100 76" stroke="#1a2e05" stroke-width="2" fill="none" stroke-linecap="round"/></g>`;
    } else if (etapa === 1) {
        cuerpo = `<defs>${glow}
            <linearGradient id="${id}c" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#99f6e4"/><stop offset=".5" stop-color="#14b8a6"/><stop offset="1" stop-color="#a16207"/></linearGradient>
            <radialGradient id="${id}h" cx=".5" cy=".5"><stop offset="0" stop-color="rgba(250,204,21,.5)"/><stop offset="1" stop-color="rgba(250,204,21,0)"/></radialGradient></defs>
            <path d="M26 6 Q60 0 94 6" stroke="#78716c" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M84 5 q10 -8 18 -2 q-8 6 -18 2z" fill="#4d7c0f"/>
            <g class="capullo" style="transform-origin:60px 6px">
                <circle class="halo" cx="60" cy="68" r="48" fill="url(#${id}h)"/>
                <line x1="60" y1="6" x2="60" y2="24" stroke="rgba(241,245,249,.6)" stroke-width="1.5"/>
                <path d="M60 22 C84 26 88 58 82 80 C77 98 66 108 60 111 C54 108 43 98 38 80 C32 58 36 26 60 22 Z" fill="url(#${id}c)" stroke="#0f766e" stroke-width="1.5"/>
                <path d="M42 56 Q60 62 78 56 M40 72 Q60 79 80 72 M43 88 Q60 95 77 88 M48 101 Q60 106 72 101" stroke="rgba(15,118,110,.65)" stroke-width="1.5" fill="none"/>
                <circle class="brilla" cx="50" cy="59" r="2.2" fill="#fde047" filter="url(#${id}g)"/>
                <circle class="brilla" cx="70" cy="59" r="2.2" fill="#fde047" filter="url(#${id}g)" style="animation-delay:.5s"/>
                <path class="grieta" d="M62 66 l-5 8 l6 5 l-4 9" stroke="#fef08a" stroke-width="2.6" fill="none" stroke-linejoin="round" filter="url(#${id}g)"/>
                <path d="M49 43 Q53 38 57 43 M63 43 Q67 38 71 43" stroke="#134e4a" stroke-width="2.3" fill="none" stroke-linecap="round"/>
                <circle cx="47" cy="48" r="2.6" fill="#fb7185" opacity=".5"/><circle cx="73" cy="48" r="2.6" fill="#fb7185" opacity=".5"/>
                <path d="M56 49 Q60 52 64 49" stroke="#134e4a" stroke-width="1.8" fill="none" stroke-linecap="round"/></g>`;
    } else {
        const radiante = etapa >= 3;
        const rayos = radiante ? `<g class="rayos" style="transform-origin:60px 70px">${Array.from({ length: 12 }, (_, i) => {
            const a = i * Math.PI / 6, x1 = 60 + Math.cos(a) * 46, y1 = 70 + Math.sin(a) * 46, x2 = 60 + Math.cos(a) * 57, y2 = 70 + Math.sin(a) * 57;
            return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#fde68a" stroke-width="2.5" stroke-linecap="round" opacity=".75"/>`; }).join('')}</g>` : '';
        const chispas = radiante ? [[18, 30, 0], [102, 26, .5], [14, 96, 1], [106, 100, .3], [60, 4, .8]].map(([x, y, d]) =>
            `<g transform="translate(${x} ${y})"><path class="chispa" style="animation-delay:${d}s" d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z" fill="#fef9c3"/></g>`).join('') : '';
        const alaFill = radiante ? 'rgba(253,230,138,.28)' : 'rgba(186,230,253,.3)';
        const alaStroke = radiante ? '#fde68a' : 'rgba(224,242,254,.85)';
        cuerpo = `<defs>${glow}
            <radialGradient id="${id}a" cx=".5" cy=".4"><stop offset="0" stop-color="#fffbeb"/><stop offset=".45" stop-color="#fde047"/><stop offset="1" stop-color="#f59e0b"/></radialGradient>
            <radialGradient id="${id}k" cx=".35" cy=".3"><stop offset="0" stop-color="#94a3b8"/><stop offset="1" stop-color="#1e293b"/></radialGradient>
            <radialGradient id="${id}h" cx=".5" cy=".5"><stop offset="0" stop-color="rgba(250,204,21,${radiante ? .7 : .5})"/><stop offset="1" stop-color="rgba(250,204,21,0)"/></radialGradient></defs>
            <circle class="halo" cx="60" cy="78" r="${radiante ? 56 : 40}" fill="url(#${id}h)"/>
            ${rayos}${chispas}
            <g class="ala-izq" style="transform-origin:56px 54px"><ellipse cx="38" cy="50" rx="22" ry="11" transform="rotate(-28 38 50)" fill="${alaFill}" stroke="${alaStroke}" stroke-width="1.3"/></g>
            <g class="ala-der" style="transform-origin:64px 54px"><ellipse cx="82" cy="50" rx="22" ry="11" transform="rotate(28 82 50)" fill="${alaFill}" stroke="${alaStroke}" stroke-width="1.3"/></g>
            <path d="M50 64 l-9 7 M70 64 l9 7 M52 70 l-8 9 M68 70 l8 9" stroke="#475569" stroke-width="2.2" stroke-linecap="round"/>
            <ellipse class="brilla" cx="60" cy="84" rx="15" ry="19" fill="url(#${id}a)" filter="url(#${id}g)"/>
            <path d="M47 80 Q60 84 73 80 M48 90 Q60 94 72 90" stroke="rgba(180,83,9,.35)" stroke-width="1.4" fill="none"/>
            <ellipse cx="60" cy="61" rx="13" ry="9" fill="#ea580c" stroke="#7c2d12" stroke-width="1.2"/>
            <path d="M60 53 V69" stroke="#9a3412" stroke-width="2" opacity=".6"/>
            <path d="M54 30 Q48 16 40 14 M66 30 Q72 16 80 14" stroke="#94a3b8" stroke-width="2" fill="none" stroke-linecap="round"/>
            <circle class="brilla" cx="40" cy="14" r="3.2" fill="#fde047" filter="url(#${id}g)"/>
            <circle class="brilla" cx="80" cy="14" r="3.2" fill="#fde047" filter="url(#${id}g)" style="animation-delay:.5s"/>
            <circle cx="60" cy="42" r="15" fill="url(#${id}k)" stroke="#0f172a" stroke-width="1.2"/>
            ${radiante ? `<ellipse cx="60" cy="23" rx="12" ry="3" fill="none" stroke="#fde68a" stroke-width="2" filter="url(#${id}g)"/>` : ''}
            ${ojos(54, 66, 41, 5.5)}
            <circle cx="48.5" cy="48" r="2.5" fill="#fb7185" opacity=".65"/><circle cx="71.5" cy="48" r="2.5" fill="#fb7185" opacity=".65"/>
            <path d="M55 49 Q60 53 65 49" stroke="#f8fafc" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
    }
    return `<svg class="lumen-svg" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lumen, etapa ${ETAPAS[etapa].nombre}">${cuerpo}</svg>`;
}

function pintarLumen(elem, etapa, forzar) {
    if (!elem) return;
    if (!forzar && elem.dataset.etapa === String(etapa)) return;
    elem.innerHTML = lumenSVG(etapa);
    elem.dataset.etapa = etapa;
}

function actualizarLuzUI(animarPill) {
    const e = etapaDe(estado.luzTotal);
    $('pill-luz').textContent = estado.luzTotal;
    ['pill-lumen', 'hero-lumen', 'lumen-grande', 'mapa-lumen-svg', 'evo-lumen'].forEach(id => pintarLumen($(id), e));
    $('hero-etapa').textContent = 'Etapa: ' + ETAPAS[e].nombre;
    const sig = ETAPAS[e + 1];
    if (sig) {
        const pct = (estado.luzTotal - ETAPAS[e].min) / (sig.min - ETAPAS[e].min) * 100;
        $('evo-mini-texto').textContent = `Evoluciona en ${sig.min - estado.luzTotal} ✨`;
        $('evo-mini-barra').style.width = pct + '%';
    } else {
        $('evo-mini-texto').textContent = 'Etapa máxima alcanzada';
        $('evo-mini-barra').style.width = '100%';
    }
    if (animarPill) { const p = $('luz-pill'); p.classList.remove('pulso'); void p.offsetWidth; p.classList.add('pulso'); }
}

/* =========================================
   6. NAVEGACIÓN
========================================= */
let seccionActual = 'inicio';

function mostrarSeccion(id) {
    if (id === seccionActual && id !== 'laberinto') return;
    document.querySelectorAll('.seccion').forEach(s => {
        const activa = s.id === id;
        s.classList.toggle('oculta', !activa);
        if (activa) { s.classList.remove('entrando'); void s.offsetWidth; s.classList.add('entrando'); }
    });
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('activo', b.dataset.nav === id));
    const anterior = seccionActual;
    seccionActual = id;
    window.scrollTo({ top: 0, behavior: REDUCIR_MOV ? 'auto' : 'smooth' });

    if (anterior === 'laberinto' && id !== 'laberinto') pausarTimer();
    if (id === 'inicio') animarMetricas();
    if (id === 'laberinto') {
        if (vistaLab === 'juego') { requestAnimationFrame(() => moverLumenMapa(false)); reanudarTimer(); }
        else { mostrarVistaLab('intro'); renderIntroLab(); }
    }
    if (id === 'faro') renderHistorial();
    if (id === 'certificado') renderCertificado();
}

document.addEventListener('click', e => {
    const b = e.target.closest('[data-nav]');
    if (b) mostrarSeccion(b.dataset.nav);
});

/* =========================================
   7. INICIO: MÉTRICAS Y FEED
========================================= */
const METRICAS = [
    { icono: '🛡️', label: 'Días sin incidentes éticos', valor: 142, sufijo: '', tendencia: 'Récord histórico', serie: [3, 4, 4, 6, 5, 7, 8, 8, 10] },
    { icono: '🛠️', label: 'Adopción del código A-R-C', valor: 98, sufijo: '%', tendencia: '+6 pts vs. trimestre anterior', serie: [70, 74, 80, 79, 85, 88, 92, 95, 98] },
    { icono: '🗼', label: 'Consultas resueltas en El Faro', valor: 1286, sufijo: '', tendencia: '+12 % este mes', serie: [20, 26, 24, 31, 35, 33, 41, 44, 49], faro: true },
    { icono: '🌱', label: 'Índice de clima laboral', valor: 4.8, sufijo: ' / 5', decimales: 1, tendencia: '+0.3 vs. año anterior', serie: [3.9, 4.1, 4.0, 4.3, 4.4, 4.4, 4.6, 4.7, 4.8] }
];

function sparkline(serie) {
    const w = 120, h = 40, min = Math.min(...serie), max = Math.max(...serie);
    const pts = serie.map((v, i) => [i / (serie.length - 1) * w, h - 4 - (v - min) / (max - min || 1) * (h - 10)]);
    const linea = pts.map(p => p.map(n => n.toFixed(1)).join(',')).join(' ');
    const gid = 'sp' + (++uidLumen);
    return `<svg class="sparkline" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
        <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(56,189,248,.35)"/><stop offset="1" stop-color="rgba(56,189,248,0)"/></linearGradient></defs>
        <polygon points="0,${h} ${linea} ${w},${h}" fill="url(#${gid})"/>
        <polyline points="${linea}" fill="none" stroke="#38bdf8" stroke-width="1.8" vector-effect="non-scaling-stroke"/></svg>`;
}

function renderMetricas() {
    const cont = $('metricas');
    cont.innerHTML = '';
    METRICAS.forEach(m => {
        const card = crear('div', 'panel metrica');
        card.innerHTML = `<div class="metrica-top"><span class="metrica-icono">${m.icono}</span><span></span></div>
            <div class="metrica-valor">0</div><div class="metrica-tendencia"></div>${sparkline(m.serie)}`;
        card.querySelector('.metrica-top span:last-child').textContent = m.label;
        card.querySelector('.metrica-tendencia').textContent = '▲ ' + m.tendencia;
        cont.appendChild(card);
    });
}

function formatear(v, m) {
    const n = m.decimales ? v.toFixed(m.decimales) : Math.round(v).toLocaleString('es-GT');
    return n + m.sufijo;
}

function animarMetricas() {
    const valores = document.querySelectorAll('.metrica-valor');
    METRICAS.forEach((m, i) => {
        const objetivo = m.faro ? m.valor + estado.faro.length : m.valor;
        const el = valores[i];
        if (REDUCIR_MOV) { el.textContent = formatear(objetivo, m); return; }
        const t0 = performance.now(), dur = 1400 + i * 150;
        const paso = t => {
            const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
            el.textContent = formatear(objetivo * e, m);
            if (p < 1) requestAnimationFrame(paso);
        };
        requestAnimationFrame(paso);
    });
}

/* Feed tipo carrusel */
const feed = { items: [], idx: 0, transcurrido: 0, ultimo: 0, pausado: false, duracion: 5200 };

function construirFeed() {
    const propios = estado.faro.slice(0, 3).map(f => ({
        tipo: f.tipo, hace: haceCuanto(f.fecha), nueva: true,
        consulta: f.texto.length > 110 ? f.texto.slice(0, 107).trim() + '…' : f.texto,
        respuesta: FARO[f.tipo].resumen
    }));
    feed.items = propios.concat(FEED_BASE);
    const vp = $('feed-viewport');
    vp.innerHTML = '';
    feed.items.forEach(it => {
        const f = FARO[it.tipo];
        const item = crear('article', 'feed-item');
        const meta = crear('div', 'feed-meta');
        meta.appendChild(crear('span', 'chip ' + f.chip, f.etiqueta));
        meta.appendChild(crear('span', it.nueva ? 'feed-nueva' : 'feed-hace', it.nueva ? 'Tu consulta · ' + it.hace : it.hace));
        item.appendChild(meta);
        item.appendChild(crear('p', 'feed-consulta', '“' + it.consulta + '”'));
        const resp = crear('div', 'feed-respuesta');
        const mini = crear('span', 'mini-lumen'); pintarLumen(mini, 2);
        const txt = crear('span'); const b = crear('b', null, 'Lumen: '); txt.appendChild(b); txt.appendChild(document.createTextNode(it.respuesta));
        resp.appendChild(mini); resp.appendChild(txt);
        item.appendChild(resp);
        item.appendChild(crear('span', 'feed-estado', '✓ Resuelta con orientación'));
        vp.appendChild(item);
    });
    feed.idx = 0; feed.transcurrido = 0;
    mostrarFeed(0, true);
}

function mostrarFeed(nuevo, inicial) {
    const items = $('feed-viewport').children;
    if (!items.length) return;
    const n = items.length;
    nuevo = (nuevo + n) % n;
    if (!inicial && items[feed.idx]) { const viejo = items[feed.idx]; viejo.classList.remove('visible'); viejo.classList.add('saliendo'); setTimeout(() => viejo.classList.remove('saliendo'), 600); }
    feed.idx = nuevo; feed.transcurrido = 0;
    items[nuevo].classList.add('visible');
    $('feed-contador').textContent = `${nuevo + 1} / ${n}`;
}

function bucleFeed(t) {
    if (!feed.ultimo) feed.ultimo = t;
    const dt = t - feed.ultimo; feed.ultimo = t;
    if (!feed.pausado && seccionActual === 'inicio' && !document.hidden) {
        feed.transcurrido += dt;
        if (feed.transcurrido >= feed.duracion) mostrarFeed(feed.idx + 1);
    }
    $('feed-barra').style.width = Math.min(100, feed.transcurrido / feed.duracion * 100) + '%';
    requestAnimationFrame(bucleFeed);
}

/* =========================================
   8. PRINCIPIOS: A-R-C INTERACTIVO
========================================= */
function seleccionarARC(letra) {
    document.querySelectorAll('.arc-letra').forEach(b => {
        const on = b.dataset.arc === letra;
        b.classList.toggle('activa', on);
        b.setAttribute('aria-selected', on);
    });
    $('arc-texto').textContent = ARC[letra].texto;
    $('arc-ejemplo').textContent = ARC[letra].ejemplo;
    const d = $('arc-detalle'); d.classList.remove('cambio'); void d.offsetWidth; d.classList.add('cambio');
}

/* =========================================
   9. EL LABERINTO DE LUMEN
========================================= */
let vistaLab = 'intro';     // intro | juego | fin
let bloqueado = true;       // true mientras no se puede elegir puerta
let ladoCorrecto = 'izq';
let turno = 0;              // invalida callbacks viejos (ruleta)
let t0Decision = 0;
let evolucionPendiente = null;

function mostrarVistaLab(v) {
    vistaLab = v;
    $('lab-intro').classList.toggle('oculta', v !== 'intro');
    $('lab-juego').classList.toggle('oculta', v !== 'juego');
    $('lab-fin').classList.toggle('oculta', v !== 'fin');
}

function renderIntroLab() {
    const e = etapaDe(estado.luzTotal), sig = ETAPAS[e + 1];
    pintarLumen($('evo-lumen'), e);
    $('evo-nombre').textContent = ETAPAS[e].nombre;
    $('evo-desc').textContent = ETAPAS[e].desc;
    if (sig) {
        $('evo-barra').style.width = ((estado.luzTotal - ETAPAS[e].min) / (sig.min - ETAPAS[e].min) * 100) + '%';
        $('evo-falta').textContent = `Te faltan ${sig.min - estado.luzTotal} ✨ para evolucionar a ${sig.nombre}.`;
    } else {
        $('evo-barra').style.width = '100%';
        $('evo-falta').textContent = 'Lumen alcanzó su máxima luz. ¡Eres un faro para tu equipo!';
    }
    const gal = $('galeria'); gal.innerHTML = '';
    ETAPAS.forEach((et, i) => {
        const it = crear('div', 'galeria-item' + (i > e ? ' bloqueada' : '') + (i === e ? ' actual' : ''));
        const slot = crear('span', 'lumen-slot'); pintarLumen(slot, i);
        it.appendChild(slot);
        it.appendChild(crear('small', null, i > e ? `${et.min} ✨` : et.nombre));
        gal.appendChild(it);
    });
    $('st-luz').textContent = estado.luzTotal;
    $('st-mejor').textContent = estado.mejor ? estado.mejor.pct + '%' : '—';
    $('st-partidas').textContent = estado.partidas.length;
    $('toggle-presion').checked = estado.presion;

    const acc = $('acciones-intro'); acc.innerHTML = '';
    if (estado.run) {
        const b1 = crear('button', 'btn btn-primario', `Continuar travesía (situación ${Math.min(estado.run.idx + 1, estado.run.nodos.length)} de ${estado.run.nodos.length})`);
        b1.onclick = () => comenzarJuego();
        const b2 = crear('button', 'btn btn-secundario', 'Empezar de nuevo');
        b2.onclick = nuevaRun;
        acc.append(b1, b2);
    } else {
        const b = crear('button', 'btn btn-primario', 'Comenzar travesía');
        b.onclick = nuevaRun;
        acc.appendChild(b);
    }
}

function nuevaRun() {
    const cats = barajar(['seguridad', 'seguridad', 'clima', 'clima', 'poder', 'poder']);
    estado.run = {
        nodos: cats.map(c => ({ tipo: 'base', cat: c, id: null, estado: 'pendiente' })),
        idx: 0, luz: 0, racha: 0, maxRacha: 0, respuestas: [], usados: []
    };
    guardar();
    comenzarJuego();
}

function comenzarJuego() {
    const run = estado.run;
    // Si se recargó justo después de responder, avanzamos al siguiente nodo
    if (run.nodos[run.idx] && run.nodos[run.idx].estado !== 'pendiente') run.idx++;
    if (run.idx >= run.nodos.length) { finalizarRun(); return; }
    mostrarVistaLab('juego');
    renderMapa();
    requestAnimationFrame(() => moverLumenMapa(false));
    entrarNodo();
}

/* ---------- MAPA DE PROGRESO ---------- */
function renderMapa(nuevoIdx = -1) {
    const run = estado.run, pista = $('mapa-pista');
    pista.querySelectorAll('.nodo').forEach(n => n.remove());
    run.nodos.forEach((n, i) => {
        const revelado = i < run.idx || n.id !== null || n.tipo === 'mariposa';
        let cls = 'nodo ' + (n.estado !== 'pendiente' ? n.estado : (i === run.idx ? 'actual' : 'pendiente'));
        if (n.tipo === 'mariposa') cls += ' mariposa';
        if (i === nuevoIdx) cls += ' nuevo';
        const d = crear('div', cls, n.tipo === 'mariposa' ? '🦋' : (revelado ? CATS[n.cat].icono : '?'));
        d.appendChild(crear('span', 'nodo-label', n.tipo === 'mariposa' ? 'Consecuencia' : (revelado ? CATS[n.cat].corto : 'Nodo ' + (i + 1))));
        d.title = revelado ? CATS[n.cat].nombre : 'Categoría sorpresa';
        pista.appendChild(d);
    });
    const meta = crear('div', 'nodo meta', '🏁');
    meta.appendChild(crear('span', 'nodo-label', 'Meta'));
    pista.appendChild(meta);
    $('pill-run').textContent = `✨ ${run.luz} / ${run.nodos.length}`;
    $('pill-racha').textContent = `🔥 Racha ${run.racha}`;
}

function moverLumenMapa(saltar) {
    const run = estado.run; if (!run) return;
    const nodos = $('mapa-pista').querySelectorAll('.nodo');
    if (!nodos.length) return;
    const centro = n => n.offsetLeft + n.offsetWidth / 2;
    const actual = nodos[Math.min(run.idx, nodos.length - 1)];
    const ini = centro(nodos[0]), fin = centro(nodos[nodos.length - 1]), c = centro(actual);
    const av = $('mapa-lumen');
    av.style.left = (c - av.offsetWidth / 2) + 'px';
    $('mapa-linea').style.left = ini + 'px';
    $('mapa-linea').style.width = (fin - ini) + 'px';
    $('mapa-progreso').style.left = ini + 'px';
    $('mapa-progreso').style.width = (c - ini) + 'px';
    if (saltar) { av.classList.remove('saltando'); void av.offsetWidth; av.classList.add('saltando'); }
    const mapa = $('mapa');
    mapa.scrollTo({ left: c - mapa.clientWidth / 2, behavior: REDUCIR_MOV ? 'auto' : 'smooth' });
}

/* ---------- FLUJO DE CADA NODO ---------- */
function burbuja(lista) { $('burbuja').textContent = azar(lista); }

function setChip(cat) {
    const chip = $('chip-cat');
    chip.classList.remove('seguridad', 'clima', 'poder', 'general', 'mariposa');
    chip.classList.add(cat);
    chip.textContent = CATS[cat].icono + ' ' + CATS[cat].nombre;
}

function resetPuertas() {
    ['puerta-izq', 'puerta-der'].forEach(id => {
        const p = $(id);
        p.className = 'puerta';
        p.disabled = true;
    });
    $('texto-izq').textContent = '…';
    $('texto-der').textContent = '…';
}

function entrarNodo() {
    const run = estado.run, nodo = run.nodos[run.idx];
    const miTurno = ++turno;
    bloqueado = true;
    detenerTimer();
    resetPuertas();
    $('feedback').classList.add('oculta');
    $('lumen-grande').classList.remove('feliz', 'triste');
    $('contador-nodo').textContent = `Situación ${run.idx + 1} de ${run.nodos.length}`;
    $('banner-mariposa').classList.toggle('oculta', nodo.tipo !== 'mariposa');
    burbuja(nodo.tipo === 'mariposa' ? FRASES_LUMEN.mariposa : FRASES_LUMEN.inicio);
    timer.restante = timer.total; pintarTimer();
    $('timer').classList.toggle('oculta', !estado.presion);

    if (nodo.id) { setChip(nodo.cat); mostrarDilema(); return; }

    // Ruleta de categoría
    const td = $('texto-dilema');
    td.className = 'esperando';
    td.textContent = 'Lumen está eligiendo la categoría de esta situación…';
    const chip = $('chip-cat'), claves = Object.keys(CATS);
    let i = 0;
    chip.classList.add('girando');
    const iv = setInterval(() => setChip(claves[i++ % claves.length]), 90);
    setTimeout(() => {
        clearInterval(iv);
        if (miTurno !== turno || !estado.run) return;
        chip.classList.remove('girando');
        setChip(nodo.cat);
        chip.classList.remove('fijado'); void chip.offsetWidth; chip.classList.add('fijado');
        nodo.id = elegirDilema(nodo.cat);
        run.usados.push(nodo.id);
        guardar();
        renderMapa();
        moverLumenMapa(false);
        mostrarDilema();
    }, REDUCIR_MOV ? 50 : 1000);
}

function elegirDilema(cat) {
    const usados = estado.run.usados;
    let pool = DILEMAS.filter(d => d.cat === cat && !d.esConsecuencia && !usados.includes(d.id));
    if (!pool.length) pool = DILEMAS.filter(d => !d.esConsecuencia && !usados.includes(d.id));
    return azar(pool).id;
}

function mostrarDilema() {
    const run = estado.run, d = DIL[run.nodos[run.idx].id];
    const td = $('texto-dilema');
    td.className = '';
    td.textContent = d.situacion;
    void td.offsetWidth; td.classList.add('aparecer');
    ladoCorrecto = Math.random() < 0.5 ? 'izq' : 'der';
    $('texto-izq').textContent = ladoCorrecto === 'izq' ? d.correcta : d.incorrecta;
    $('texto-der').textContent = ladoCorrecto === 'der' ? d.correcta : d.incorrecta;
    $('puerta-izq').disabled = false;
    $('puerta-der').disabled = false;
    bloqueado = false;
    t0Decision = performance.now();
    iniciarTimer();
}

/* ---------- TEMPORIZADOR (BARRA DE PRESIÓN) ---------- */
const timer = { total: SEGUNDOS_PUERTA * 1000, restante: SEGUNDOS_PUERTA * 1000, activo: false, pausado: false, ultimo: 0, raf: 0 };

function iniciarTimer() {
    timer.restante = timer.total;
    pintarTimer();
    if (!estado.presion) return;
    timer.pausado = false;
    if (seccionActual !== 'laberinto' || document.hidden) { timer.pausado = true; return; }
    timer.activo = true;
    timer.ultimo = performance.now();
    cancelAnimationFrame(timer.raf);
    timer.raf = requestAnimationFrame(tickTimer);
}
function tickTimer(ahora) {
    if (!timer.activo) return;
    timer.restante -= ahora - timer.ultimo;
    timer.ultimo = ahora;
    if (timer.restante <= 0) { timer.restante = 0; pintarTimer(); responder('tiempo'); return; }
    pintarTimer();
    timer.raf = requestAnimationFrame(tickTimer);
}
function pintarTimer() {
    const p = timer.restante / timer.total;
    $('timer-relleno').style.width = (p * 100) + '%';
    $('timer-seg').textContent = Math.ceil(timer.restante / 1000) + 's';
    const t = $('timer');
    t.classList.toggle('alerta', p <= .5 && p > .25);
    t.classList.toggle('critico', p <= .25 && p > 0);
    $('escenario').classList.toggle('presion', timer.activo && p <= .25);
}
function detenerTimer() {
    timer.activo = false; timer.pausado = false;
    cancelAnimationFrame(timer.raf);
    $('escenario').classList.remove('presion');
}
function pausarTimer() {
    if (!timer.activo) return;
    timer.activo = false; timer.pausado = true;
    cancelAnimationFrame(timer.raf);
}
function reanudarTimer() {
    if (!timer.pausado || bloqueado || !estado.presion) return;
    timer.pausado = false; timer.activo = true;
    timer.ultimo = performance.now();
    timer.raf = requestAnimationFrame(tickTimer);
}
document.addEventListener('visibilitychange', () => {
    if (document.hidden) pausarTimer();
    else if (seccionActual === 'laberinto' && vistaLab === 'juego') reanudarTimer();
});

/* ---------- RESPONDER ---------- */
function responder(lado) {
    if (bloqueado || !estado.run) return;
    bloqueado = true;
    const ms = estado.presion ? timer.total - timer.restante : performance.now() - t0Decision;
    detenerTimer();

    const run = estado.run, nodo = run.nodos[run.idx], d = DIL[nodo.id];
    const porTiempo = lado === 'tiempo';
    const acierto = !porTiempo && lado === ladoCorrecto;

    // Puertas: se abre la elegida y se revela la correcta
    const pIzq = $('puerta-izq'), pDer = $('puerta-der');
    pIzq.disabled = pDer.disabled = true;
    const pCorrecta = ladoCorrecto === 'izq' ? pIzq : pDer;
    const pOtra = ladoCorrecto === 'izq' ? pDer : pIzq;
    pCorrecta.classList.add('correcta');
    if (acierto) { pCorrecta.classList.add('abierta'); pOtra.classList.add('atenuada'); }
    else if (!porTiempo) { pOtra.classList.add('abierta', 'incorrecta'); }
    else { pOtra.classList.add('atenuada'); }

    // Puntaje, racha y luz global
    nodo.estado = acierto ? 'ok' : 'mal';
    run.respuestas.push({ id: d.id, acierto, porTiempo, ms: Math.round(ms), mariposa: nodo.tipo === 'mariposa' });
    if (acierto) {
        const antes = etapaDe(estado.luzTotal);
        run.luz++; run.racha++; run.maxRacha = Math.max(run.maxRacha, run.racha);
        estado.luzTotal++;
        const despues = etapaDe(estado.luzTotal);
        if (despues > antes) evolucionPendiente = despues;
    } else {
        run.racha = 0;
    }

    // Efecto mariposa: la mala decisión agrega su consecuencia al camino
    let consecuencia = null;
    if (!acierto && d.consecuencia && !run.usados.includes(d.consecuencia)) {
        consecuencia = DIL[d.consecuencia];
        run.nodos.splice(run.idx + 1, 0, { tipo: 'mariposa', cat: consecuencia.cat, id: consecuencia.id, estado: 'pendiente' });
        run.usados.push(consecuencia.id);
    }
    guardar();
    renderMapa(consecuencia ? run.idx + 1 : -1);
    moverLumenMapa(false);
    actualizarLuzUI(acierto);

    // Reacción de Lumen
    const lg = $('lumen-grande');
    lg.classList.remove('feliz', 'triste'); void lg.offsetWidth;
    lg.classList.add(acierto ? 'feliz' : 'triste');
    burbuja(acierto ? FRASES_LUMEN.acierto : porTiempo ? FRASES_LUMEN.tiempo : FRASES_LUMEN.error);

    // Retroalimentación
    const fb = $('feedback');
    fb.className = 'feedback ' + (acierto ? 'exito' : 'error');
    $('fb-titulo').textContent = acierto ? azar(['✨ ¡Decisión ética brillante!', '✨ ¡Eso es integridad!', '✨ ¡Lumen brilla más fuerte!'])
        : porTiempo ? '⌛ Se acabó el tiempo' : '⚠️ Cuidado, la luz se atenúa';
    $('fb-principio').textContent = PRINCIPIOS[d.principio];
    $('fb-texto').textContent = (porTiempo ? 'No decidir también es una decisión. ' : '') + d.explicacion;
    const fc = $('fb-correcta');
    fc.classList.toggle('oculta', acierto);
    if (!acierto) { fc.innerHTML = ''; fc.appendChild(crear('b', null, 'La decisión íntegra era: ')); fc.appendChild(document.createTextNode(d.correcta)); }
    $('aviso-mariposa').classList.toggle('oculta', !consecuencia);
    if (consecuencia) $('aviso-gancho').textContent = consecuencia.gancho;
    $('btn-siguiente').textContent = run.idx + 1 >= run.nodos.length ? 'Ver resultados 🏁' : 'Continuar';
    if (!REDUCIR_MOV) setTimeout(() => fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 150);

    if (evolucionPendiente !== null) setTimeout(mostrarEvolucion, 1100);
}

function siguiente() {
    if (!estado.run || $('feedback').classList.contains('oculta')) return;
    const run = estado.run;
    run.idx++;
    guardar();
    if (run.idx >= run.nodos.length) { finalizarRun(); return; }
    renderMapa();
    moverLumenMapa(true);
    entrarNodo();
    window.scrollTo({ top: $('mapa').getBoundingClientRect().top + window.scrollY - 90, behavior: REDUCIR_MOV ? 'auto' : 'smooth' });
}

/* ---------- EVOLUCIÓN ---------- */
function mostrarEvolucion() {
    const e = evolucionPendiente; evolucionPendiente = null;
    if (e === null) return;
    pintarLumen($('overlay-lumen'), e, true);
    $('overlay-etapa').textContent = ETAPAS[e].nombre;
    $('overlay-desc').textContent = ETAPAS[e].desc;
    $('overlay-evo').classList.remove('oculta');
    $('btn-cerrar-evo').focus();
    if (e >= 2) lanzarConfeti(90);
}
function cerrarEvolucion() {
    $('overlay-evo').classList.add('oculta');
    const b = $('btn-siguiente'); if (!$('feedback').classList.contains('oculta')) b.focus();
}

/* ---------- FIN DE LA TRAVESÍA ---------- */
function nivel(pct) {
    if (pct >= 85) return { titulo: 'Certificado de Excelencia Ética', frase: 'un juicio ético sobresaliente', cabecera: '¡Brillas como un faro!' };
    if (pct >= 60) return { titulo: 'Certificado de Mérito Ético', frase: 'un sólido criterio ético', cabecera: '¡Buen camino, tu luz crece!' };
    return { titulo: 'Constancia de Participación Ética', frase: 'compromiso con la reflexión ética', cabecera: 'Tu luz merece otra oportunidad' };
}

function finalizarRun() {
    detenerTimer();
    const run = estado.run;
    const total = run.nodos.length, pct = Math.round(run.luz / total * 100);
    const decididas = run.respuestas.filter(r => !r.porTiempo);
    const prom = decididas.length ? decididas.reduce((a, r) => a + r.ms, 0) / decididas.length / 1000 : null;
    const folio = 'LUM-' + Date.now().toString(36).toUpperCase().slice(-5) + '-' + Math.random().toString(36).slice(2, 5).toUpperCase();
    const r = { luz: run.luz, total, pct, fecha: Date.now(), folio, maxRacha: run.maxRacha,
        mariposas: run.nodos.filter(n => n.tipo === 'mariposa').length, prom, respuestas: run.respuestas };
    estado.partidas.push({ luz: r.luz, total, pct, fecha: r.fecha });
    estado.partidas = estado.partidas.slice(-50);
    if (!estado.mejor || pct > estado.mejor.pct) estado.mejor = { luz: r.luz, total, pct };
    estado.ultimo = r;
    estado.run = null;
    guardar();
    renderFin(r);
    mostrarVistaLab('fin');
    window.scrollTo({ top: 0, behavior: REDUCIR_MOV ? 'auto' : 'smooth' });
    if (pct >= 60) setTimeout(() => lanzarConfeti(170), 400);
}

function renderFin(r) {
    const nv = nivel(r.pct);
    pintarLumen($('fin-lumen'), etapaDe(estado.luzTotal), true);
    $('fin-titulo').textContent = nv.cabecera;
    $('fin-sub').textContent = r.pct >= 60
        ? `Obtuviste ${r.luz} de ${r.total} puntos de luz. Tu certificado ya está listo.`
        : `Obtuviste ${r.luz} de ${r.total} puntos de luz. Revisa tus decisiones y vuelve a intentarlo: cada travesía es distinta.`;
    $('fs-luz').textContent = `${r.luz}/${r.total}`;
    $('fs-racha').textContent = r.maxRacha;
    $('fs-mariposa').textContent = r.mariposas;
    $('fs-tiempo').textContent = r.prom !== null ? r.prom.toFixed(1) + ' s' : '—';
    const aro = $('aro-valor');
    aro.style.strokeDashoffset = 339.29;
    requestAnimationFrame(() => requestAnimationFrame(() => { aro.style.strokeDashoffset = 339.29 * (1 - r.pct / 100); }));
    let n = 0;
    const t0 = performance.now();
    const contar = t => { const p = Math.min(1, (t - t0) / 1500); n = Math.round(r.pct * (1 - Math.pow(1 - p, 3))); $('fin-pct').textContent = n + '%'; if (p < 1) requestAnimationFrame(contar); };
    requestAnimationFrame(contar);

    const ul = $('decisiones'); ul.innerHTML = '';
    r.respuestas.forEach(res => {
        const d = DIL[res.id];
        const li = crear('li', 'decision' + (res.mariposa ? ' es-mariposa' : ''));
        li.appendChild(crear('span', null, res.mariposa ? '🦋' : CATS[d.cat].icono));
        li.appendChild(crear('span', null, d.situacion.length > 90 ? d.situacion.slice(0, 88).trim() + '…' : d.situacion));
        li.appendChild(crear('span', 'res ' + (res.acierto ? 'ok' : 'mal'), res.acierto ? '✓ Íntegra' : res.porTiempo ? '⌛ Sin decidir' : '✗ A mejorar'));
        ul.appendChild(li);
    });
}

/* ---------- TECLADO ---------- */
document.addEventListener('keydown', e => {
    if (!$('overlay-evo').classList.contains('oculta')) {
        if (e.key === 'Escape' || e.key === 'Enter') { e.preventDefault(); cerrarEvolucion(); }
        return;
    }
    if (seccionActual !== 'laberinto' || vistaLab !== 'juego') return;
    if (e.target.matches('input, textarea')) return;
    if (!bloqueado && (e.key === '1' || e.key === 'ArrowLeft')) { e.preventDefault(); responder('izq'); }
    else if (!bloqueado && (e.key === '2' || e.key === 'ArrowRight')) { e.preventDefault(); responder('der'); }
    else if (e.key === 'Enter' && !$('feedback').classList.contains('oculta')) { e.preventDefault(); siguiente(); }
});

/* =========================================
   10. EL FARO DE LUMEN
========================================= */
function analizarConsulta(texto) {
    const t = normalizar(texto);
    let mejor = 'general', puntos = 0;
    Object.entries(FARO).forEach(([clave, f]) => {
        const p = f.claves.reduce((acc, k) => acc + (t.includes(k) ? 1 : 0), 0);
        if (p > puntos) { puntos = p; mejor = clave; }
    });
    return mejor;
}

function consultarLumen() {
    const ta = $('texto-consulta'), texto = ta.value.trim();
    if (texto.length < 10) {
        toast('✍️ Cuéntale a Lumen un poco más: al menos 10 caracteres.');
        ta.focus();
        return;
    }
    const btn = $('btn-faro');
    btn.disabled = true;
    const caja = $('respuesta-lumen');
    caja.innerHTML = '';
    const pensando = crear('div', 'pensando');
    const mini = crear('span', 'mini-lumen'); pintarLumen(mini, etapaDe(estado.luzTotal));
    pensando.appendChild(mini);
    pensando.appendChild(crear('span', null, 'Lumen está analizando tu situación'));
    const puntos = crear('span', 'puntos'); puntos.innerHTML = '<span></span><span></span><span></span>';
    pensando.appendChild(puntos);
    caja.appendChild(pensando);

    setTimeout(() => {
        const tipo = analizarConsulta(texto);
        pintarRespuesta(tipo);
        estado.faro.unshift({ texto, tipo, fecha: Date.now() });
        estado.faro = estado.faro.slice(0, 30);
        guardar();
        renderHistorial();
        construirFeed();
        ta.value = '';
        actualizarContador();
        btn.disabled = false;
    }, REDUCIR_MOV ? 300 : 1500);
}

function pintarRespuesta(tipo) {
    const f = FARO[tipo], caja = $('respuesta-lumen');
    caja.innerHTML = '';
    const r = crear('div', 'respuesta');
    const cab = crear('div', 'respuesta-cab');
    const mini = crear('span', 'mini-lumen'); pintarLumen(mini, etapaDe(estado.luzTotal));
    cab.appendChild(mini);
    cab.appendChild(crear('h3', null, 'Lumen analizó tu situación'));
    cab.appendChild(crear('span', 'chip ' + f.chip, f.etiqueta));
    r.appendChild(cab);
    r.appendChild(crear('p', null, f.diagnostico));
    const ol = crear('ol', 'resp-pasos');
    f.pasos.forEach(p => ol.appendChild(crear('li', null, p)));
    r.appendChild(ol);
    r.appendChild(crear('p', 'resp-canal', '📍 Canal recomendado: ' + f.canal));
    r.appendChild(crear('blockquote', null, '“' + azar(f.frases) + '”'));
    caja.appendChild(r);
}

function renderHistorial() {
    const ul = $('historial-lista');
    ul.innerHTML = '';
    $('btn-borrar-historial').classList.toggle('oculta', !estado.faro.length);
    if (!estado.faro.length) {
        const v = crear('li', 'vacio', 'Aún no has hecho consultas. Escribe tu primera situación y Lumen te orientará.');
        ul.appendChild(v);
        return;
    }
    estado.faro.forEach(c => {
        const f = FARO[c.tipo] || FARO.general;
        const li = crear('li', 'historial-item');
        const fila = crear('div', 'fila');
        fila.appendChild(crear('span', 'chip ' + f.chip, f.etiqueta));
        const t = crear('time', null, haceCuanto(c.fecha));
        t.dateTime = new Date(c.fecha).toISOString();
        fila.appendChild(t);
        li.appendChild(fila);
        li.appendChild(crear('p', null, c.texto));
        li.style.cursor = 'pointer';
        li.title = 'Ver de nuevo la orientación';
        li.onclick = () => { pintarRespuesta(c.tipo); $('respuesta-lumen').scrollIntoView({ behavior: 'smooth', block: 'center' }); };
        ul.appendChild(li);
    });
}

function actualizarContador() {
    $('contador-chars').textContent = `${$('texto-consulta').value.length} / 600`;
}

/* =========================================
   11. CERTIFICADO
========================================= */
function renderCertificado() {
    const r = estado.ultimo;
    $('cert-bloqueado').classList.toggle('oculta', !!r);
    $('cert-contenido').classList.toggle('oculta', !r);
    if (!r) { pintarLumen($('cert-bloq-lumen'), etapaDe(estado.luzTotal)); return; }
    const nv = nivel(r.pct);
    pintarLumen($('cert-lumen'), etapaDe(estado.luzTotal), true);
    $('cert-titulo').textContent = nv.titulo;
    $('cert-texto').textContent = `por demostrar ${nv.frase} en el Laberinto de Lumen, obteniendo ${r.luz} de ${r.total} puntos de luz (${r.pct} %) y aplicando los principios de Honestidad y Respeto, Justicia y Equidad, y Crecimiento ante el Error.`;
    $('cert-fecha').textContent = new Date(r.fecha).toLocaleDateString('es-GT', { day: 'numeric', month: 'long', year: 'numeric' });
    $('cert-folio').textContent = r.folio;
    $('nombre-usuario').value = estado.nombre;
    pintarNombre();
}
function pintarNombre() {
    const n = $('cert-nombre');
    n.textContent = estado.nombre || 'Tu nombre aquí';
    n.classList.toggle('vacio', !estado.nombre);
}
function imprimirCertificado() {
    if (!estado.nombre) { toast('Escribe tu nombre para emitir el certificado.'); $('nombre-usuario').focus(); return; }
    try { window.print(); }
    catch (e) { toast('Usa Ctrl + P (o Cmd + P) y elige “Guardar como PDF”.'); }
}

/* =========================================
   12. EFECTOS: CIELO DE LUCIÉRNAGAS Y CONFETI
========================================= */
(function cieloLuciernagas() {
    const c = $('cielo'), ctx = c.getContext('2d');
    let w = 0, h = 0, parts = [];
    const nueva = () => ({ x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.6 + .6,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .22 - .05,
        f: Math.random() * Math.PI * 2, vf: .01 + Math.random() * .025, hue: Math.random() < .82 ? 48 : 199 });
    function ajustar() {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        w = window.innerWidth; h = window.innerHeight;
        c.width = w * dpr; c.height = h * dpr;
        c.style.width = w + 'px'; c.style.height = h + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        parts = Array.from({ length: Math.round(Math.min(70, w * h / 20000)) }, nueva);
        if (REDUCIR_MOV) dibujar();
    }
    function dibujar() {
        ctx.clearRect(0, 0, w, h);
        for (const p of parts) {
            if (!REDUCIR_MOV) {
                p.f += p.vf;
                p.x += p.vx + Math.sin(p.f * .7) * .15; p.y += p.vy;
                if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
                if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;
            }
            const a = .2 + .8 * Math.pow((Math.sin(p.f) + 1) / 2, 2);
            const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
            g.addColorStop(0, `hsla(${p.hue},95%,65%,${a})`);
            g.addColorStop(1, `hsla(${p.hue},95%,65%,0)`);
            ctx.fillStyle = g;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2); ctx.fill();
        }
    }
    function bucle() { if (!document.hidden) dibujar(); requestAnimationFrame(bucle); }
    window.addEventListener('resize', ajustar);
    ajustar();
    if (!REDUCIR_MOV) requestAnimationFrame(bucle);
})();

function lanzarConfeti(cantidad) {
    if (REDUCIR_MOV) return;
    const c = $('confeti'), ctx = c.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2), w = window.innerWidth, h = window.innerHeight;
    c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colores = ['#facc15', '#fde68a', '#38bdf8', '#22c55e', '#f59e0b', '#c084fc'];
    const ps = Array.from({ length: cantidad }, () => ({
        x: w / 2 + (Math.random() - .5) * 240, y: h * .38, vx: (Math.random() - .5) * 15, vy: -Math.random() * 14 - 5,
        r: Math.random() * 7 + 4, rot: Math.random() * 6, vr: (Math.random() - .5) * .35, c: azar(colores) }));
    const t0 = performance.now();
    (function paso(t) {
        ctx.clearRect(0, 0, w, h);
        let vivos = 0;
        for (const p of ps) {
            p.vy += .32; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
            if (p.y < h + 20) {
                vivos++;
                ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
                ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2);
                ctx.restore();
            }
        }
        if (vivos && t - t0 < 5000) requestAnimationFrame(paso); else ctx.clearRect(0, 0, w, h);
    })(t0);
}

/* =========================================
   13. INICIALIZACIÓN
========================================= */
function init() {
    pintarLumen($('logo-lumen'), 2);
    renderMetricas();
    actualizarLuzUI(false);
    construirFeed();
    requestAnimationFrame(bucleFeed);
    animarMetricas();
    seleccionarARC('A');

    // Feed: controles y pausa al pasar el cursor
    $('feed-prev').onclick = () => mostrarFeed(feed.idx - 1);
    $('feed-next').onclick = () => mostrarFeed(feed.idx + 1);
    $('feed').addEventListener('mouseenter', () => feed.pausado = true);
    $('feed').addEventListener('mouseleave', () => feed.pausado = false);
    $('feed').addEventListener('focusin', () => feed.pausado = true);
    $('feed').addEventListener('focusout', () => feed.pausado = false);

    // A-R-C
    document.querySelectorAll('.arc-letra').forEach(b => b.onclick = () => seleccionarARC(b.dataset.arc));

    // Laberinto
    $('puerta-izq').onclick = () => responder('izq');
    $('puerta-der').onclick = () => responder('der');
    $('btn-siguiente').onclick = siguiente;
    $('btn-otra').onclick = nuevaRun;
    $('btn-cerrar-evo').onclick = cerrarEvolucion;
    $('btn-salir').onclick = () => { turno++; detenerTimer(); bloqueado = true; mostrarVistaLab('intro'); renderIntroLab(); };
    $('toggle-presion').onchange = e => { estado.presion = e.target.checked; guardar(); };
    let confirmando = false;
    $('btn-reiniciar').onclick = e => {
        if (!confirmando) {
            confirmando = true;
            e.target.textContent = '¿Seguro? Toca otra vez para borrar todo';
            setTimeout(() => { confirmando = false; e.target.textContent = 'Reiniciar mi progreso'; }, 3500);
            return;
        }
        const faroGuardado = estado.faro;
        estado = estadoInicial();
        estado.faro = faroGuardado;
        guardar();
        confirmando = false; e.target.textContent = 'Reiniciar mi progreso';
        actualizarLuzUI(false);
        renderIntroLab();
        toast('Progreso reiniciado. Lumen vuelve a ser una oruga 🐛');
    };
    window.addEventListener('resize', () => { if (seccionActual === 'laberinto' && vistaLab === 'juego') moverLumenMapa(false); });

    // El Faro
    $('btn-faro').onclick = consultarLumen;
    $('texto-consulta').addEventListener('input', actualizarContador);
    $('texto-consulta').addEventListener('keydown', e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) consultarLumen(); });
    SUGERENCIAS.forEach(s => {
        const b = crear('button', 'sugerencia', s);
        b.onclick = () => { $('texto-consulta').value = s + '. '; actualizarContador(); $('texto-consulta').focus(); };
        $('sugerencias').appendChild(b);
    });
    $('btn-borrar-historial').onclick = () => { estado.faro = []; guardar(); renderHistorial(); construirFeed(); toast('Historial de El Faro borrado.'); };

    // Certificado
    $('nombre-usuario').addEventListener('input', e => { estado.nombre = e.target.value.trim().slice(0, 60); pintarNombre(); guardar(); });
    $('btn-imprimir').onclick = imprimirCertificado;

    if (estado.run) setTimeout(() => toast('Tienes una travesía en curso. Continúala desde el Laberinto.'), 1600);
}
init();