const initializeGDevelopJs = require('../../Binaries/embuild/GDevelop.js/libGD.js');
const { makeMinimalGDJSMock } = require('../TestUtils/GDJSMocks.js');
const {
  generateCompiledEventsForLayout,
} = require('../TestUtils/CodeGenerationHelpers.js');

describe('libGD.js - GDJS Code Generation integration tests', function () {
  let gd = null;
  beforeAll(async () => {
    gd = await initializeGDevelopJs();
  });

  let project = null;
  let layout = null;
  beforeEach(() => {
    project = new gd.ProjectHelper.createNewGDJSProject();
    layout = project.insertNewLayout('Scene', 0);
  });

  const generateAndRunVariableAffectationWithConditions = (
    conditions
  ) => {
    layout.getVariables().insertNew('SuccessVariable', 0).setValue(0);
    const serializedLayoutEvents = gd.Serializer.fromJSObject([
      {
        type: 'BuiltinCommonInstructions::Standard',
        conditions,
        actions: [
          {
            type: { value: 'SetNumberVariable' },
            parameters: ['SuccessVariable', '=', '1'],
          },
        ],
        events: [],
      },
    ]);
    layout.getEvents().unserializeFrom(project, serializedLayoutEvents);

    const runCompiledEvents = generateCompiledEventsForLayout(
      gd,
      project,
      layout
    );

    const serializedSceneElement = new gd.SerializerElement();
    layout.serializeTo(serializedSceneElement);

    const { gdjs, runtimeScene } = makeMinimalGDJSMock({
      sceneData: JSON.parse(gd.Serializer.toJSON(serializedSceneElement)),
    });
    serializedSceneElement.delete();

    runCompiledEvents(gdjs, runtimeScene, []);
    return runtimeScene;
  };

  it('can generate a string variable condition that is true', function () {
    layout.getVariables().insertNew('MyVariable', 0).setString("Same value");
    const runtimeScene = generateAndRunVariableAffectationWithConditions(
      [
        {
          type: { inverted: false, value: 'StringVariable' },
          parameters: ['MyVariable', '=', '"Same value"'],
        },
      ]
    );

    expect(
      runtimeScene.getVariables().get('SuccessVariable').getAsNumber()
    ).toBe(1);
  });

  it('can generate a string variable condition that is false', function () {
    layout.getVariables().insertNew('MyVariable', 0).setString("Not the same");
    const runtimeScene = generateAndRunVariableAffectationWithConditions(
      [
        {
          type: { inverted: false, value: 'StringVariable' },
          parameters: ['MyVariable', '=', '"Different"'],
        },
      ]
    );

    expect(
      runtimeScene.getVariables().get('SuccessVariable').getAsNumber()
    ).toBe(0);
  });

  it('can generate a string variable condition that is true with a contains operator', function () {
    layout.getVariables().insertNew('MyVariable', 0).setString("Hello world!");
    const runtimeScene = generateAndRunVariableAffectationWithConditions(
      [
        {
          type: { inverted: false, value: 'StringVariable' },
          parameters: ['MyVariable', 'contains', '"world"'],
        },
      ]
    );

    expect(
      runtimeScene.getVariables().get('SuccessVariable').getAsNumber()
    ).toBe(1);
  });

  it('can generate a string variable condition that is false with a contains operator', function () {
    layout.getVariables().insertNew('MyVariable', 0).setString("Hello world!");
    const runtimeScene = generateAndRunVariableAffectationWithConditions(
      [
        {
          type: { inverted: false, value: 'StringVariable' },
          parameters: ['MyVariable', 'contains', '"Hi!"'],
        },
      ]
    );

    expect(
      runtimeScene.getVariables().get('SuccessVariable').getAsNumber()
    ).toBe(0);
  });
});
