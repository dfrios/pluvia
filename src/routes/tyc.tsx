import { createFileRoute } from '@tanstack/react-router';
import type { ReactNode } from 'react';

interface TitleProps {
  headingType: 'H1' | 'H2';
  children: ReactNode;
}

export const Route = createFileRoute('/tyc')({
  component: RouteComponent,
});

const Title = (props: TitleProps) => {
  const { headingType, children } = props;

  return headingType === 'H1' ? (
    <h1 className="font-bold text-2xl my-6">{children}</h1>
  ) : (
    <h2 className="font-bold text-xl my-4">{children}</h2>
  );
};

const Header = () => {
  return (
    <div className="my-8">
      <Title headingType="H1">TÉRMINOS Y CONDICIONES DE USO DE LA PLATAFORMA "PLUVIA"</Title>
      <p>
        <span className="font-bold">Fecha de última actualización:</span> 6 de septiembre de 2026
      </p>
      <p>
        <span className="font-bold">Jurisdicción:</span> República de Colombia
      </p>
    </div>
  );
};

const Acceptance = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">1. ACEPTACIÓN DE LOS TÉRMINOS Y CONDICIONES</Title>
      <p>
        Al interactuar con la plataforma Pluvia a través de la aplicación de mensajería WhatsApp, el
        Usuario (en adelante, "el Usuario") acepta de manera expresa, previa e informada la
        totalidad de los presentes Términos y Condiciones de Uso. Si el Usuario no está de acuerdo
        con alguna de las disposiciones contenidas en este documento, deberá abstenerse de utilizar
        el servicio.
      </p>
    </div>
  );
};

const Description = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">2. DESCRIPCIÓN DEL SERVICIO Y PROPÓSITO</Title>
      <p>
        <span className="font-bold">Pluvia</span> es una plataforma tecnológica orientada a la
        recolección, procesamiento, almacenamiento y consulta colaborativa de datos pluviométricos
        (niveles de precipitación de agua) provenientes de pluviómetros instalados a nivel global.
        El servicio funciona mediante una integración conversacional en WhatsApp conectada a través
        de la API oficial de Meta Platforms, Inc., utilizando la infraestructura de servidores de
        Pluvia como punto de enlace (callback) para procesar las solicitudes, almacenar la
        información en bases de datos y retornar respuestas guiadas.
      </p>
    </div>
  );
};

const Journey = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">
        3. FLUJO DE INTERACCIÓN <span className="font-italic">(USER JOURNEY)</span>
      </Title>
      <p>El uso de la plataforma sigue el siguiente procedimiento secuencial:</p>
      <ol className="my-4 list-decimal list-outside pl-4 ml-4">
        <li>
          <span className="font-bold">Aceptación Previa: </span>Ante el primer mensaje o saludo del
          Usuario, la plataforma verifica si los Términos y Condiciones han sido aceptados. De no
          ser así, presentará una solicitud formal de aceptación.
        </li>
        <li>
          <span className="font-bold">Identificación y Registro: </span>Pluvia utiliza el número de
          teléfono celular o el nombre de usuario de WhatsApp como identificador único. Si el
          Usuario no existe en la base de datos, se le solicitará ingresar un nombre de registro.
        </li>
        <li>
          <span className="font-bold">Selección de Operación: </span>Registrado el Usuario, la
          plataforma ofrecerá las siguientes opciones:
          <ul className="list-disc ml-4 list-outside">
            <li>
              <span className="font-bold">Agregar pluviómetro: </span>Requiere que el Usuario
              comparta la posición geográfica (ubicación GPS) y el nombre descriptivo del
              pluviómetro para su registro en el sistema.
            </li>
            <li>
              <span className="font-bold">Registrar nivel de agua: </span>Permite seleccionar un
              pluviómetro previamente registrado mediante una lista o compartiendo la ubicación
              geográfica actual para identificar los dispositivos más cercanos.
            </li>
          </ul>
        </li>
        <li>
          <span className="font-bold">Captura de Lectura: </span>El Usuario ingresa el volumen de
          agua capturado, medido en milímetros (mm).
        </li>
      </ol>
    </div>
  );
};

const DataProtection = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">4. PROTECCIÓN DE DATOS PERSONALES (NORMATIVIDAD COLOMBIANA)</Title>
      <p>
        El tratamiento de los datos personales suministrados por el Usuario se rige conforme a la
        legislación de la <span className="font-bold">República de Colombia</span>, específicamente
        la <span className="font-bold">Ley Estatutaria 1581 de 2012</span>, el Decreto 1377 de 2013
        y demás normas complementarias sobre Hábeas Data.
      </p>
      <ol className="my-4 list-decimal list-outside pl-4 ml-4">
        <li>
          <span className="font-bold">Datos personales objeto de tratamiento: </span>Número de
          teléfono móvil, nombre de usuario de WhatsApp y el nombre suministrado voluntariamente
          durante el registro.
        </li>
        <li>
          <span className="font-bold">Finalidad: </span>Identificación dentro del sistema,
          autenticación de lecturas, vinculación de registros de precipitación y notificaciones de
          servicio.
        </li>
        <li>
          <span className="font-bold">Derechos del Titular: </span>El Usuario podrá ejercer en todo
          momento sus derechos de conocer, actualizar, rectificar y solicitar la supresión de sus
          datos personales a través de los canales de soporte de Pluvia.
        </li>
      </ol>
    </div>
  );
};

const Privacy = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">5. POLÍTICAS DE PRIVACIDAD Y SERVICIOS DE TERCEROS</Title>
      <p>
        El funcionamiento de Pluvia depende de la integración con proveedores tecnológicos de
        infraestructura. El Usuario reconoce y acepta que el paso y almacenamiento de la información
        está sujeto a las políticas de cada proveedor:
      </p>
      <ol className="my-4 list-decimal list-outside pl-4 ml-4">
        <li>
          <span className="font-bold">Meta Platforms, Inc. (WhatsApp): </span>La transmisión de
          mensajes, ubicaciones y archivos adjuntos a través del chat se rige bajo los Términos de
          Servicio y Políticas de Privacidad de Meta.
        </li>
        <li>
          <span className="font-bold">Cloudflare, Inc.: </span>El tránsito seguro de datos, cifrado
          y gestión del callback entre Meta y los servidores de Pluvia se rige bajo las Políticas de
          Privacidad y Términos de Cloudflare.
        </li>
        <li>
          <span className="font-bold">Supabase, Inc.: </span>El almacenamiento persistente de las
          bases de datos relacionales y de identificación de usuarios se rige bajo las Políticas de
          Privacidad y Seguridad de Supabase.
        </li>
      </ol>
    </div>
  );
};

const OpenData = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">6. LICENCIA Y USO DE LA INFORMACIÓN (OPEN DATA)</Title>
      <p>
        La información meteorológica e hidrológica generada por los usuarios en la plataforma no
        constituye un dato personal sensible.
      </p>
      <ul className="my-4 list-disc list-outside pl-4 ml-4">
        <li>
          <span className="font-bold">Licencia ODbL (Open Database License): </span>Toda la
          información de los pluviómetros (nombre público del dispositivo, coordenadas geográficas y
          registros de precipitación en milímetros) se recolecta, almacena y comparte bajo la
          licencia abierta <span className="font-bold">ODbL</span>.
        </li>
        <li>
          <span className="font-bold">Condiciones de Uso de los Datos: </span>La información de los
          pluviómetros puede ser utilizada, reutilizada, redistribuida y analizada libremente para
          fines comunitarios, científicos, académicos o comerciales, sin necesidad de dar atribución
          individualizada al Usuario que registró el dato específico.
        </li>
      </ul>
    </div>
  );
};

const Obligations = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">7. OBLIGACIONES Y USO ACEPTABLE</Title>
      <p>El Usuario se compromete a hacer un uso diligente de la plataforma y garantiza que:</p>
      <ul className="my-4 list-disc list-outside pl-4 ml-4">
        <li>
          Las lecturas de nivel de agua (mm) ingresadas corresponden a mediciones reales y
          verídicas.
        </li>
        <li>La ubicación geográfica asignada a los pluviómetros es precisa.</li>
        <li>
          No utilizará el servicio para enviar spam, código malicioso o alterar la operación técnica
          de Pluvia.
        </li>
      </ul>
    </div>
  );
};

const Modifications = () => {
  return (
    <div className="my-8">
      <Title headingType="H2">8. MODIFICACIONES Y CONTACTO</Title>
      <p>
        <span className="font-bold">Pluvia</span> se reserva el derecho de modificar los presentes
        Términos y Condiciones en cualquier momento. Cualquier actualización será notificada al
        Usuario mediante el canal de WhatsApp antes de continuar haciendo uso del servicio.
      </p>
    </div>
  );
};

function RouteComponent() {
  return (
    <section className="box-container">
      <Header />
      <Acceptance />
      <Description />
      <Journey />
      <DataProtection />
      <Privacy />
      <OpenData />
      <Obligations />
      <Modifications />
    </section>
  );
}
